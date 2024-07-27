import { afterEach, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import enJSON from '../../public/locales/en.json'
import deJSON from '../../public/locales/de.json'
import { render, screen, userEvent } from '../test/testUtils.ts'
import { CurrencyConverter } from './CurrencyConverter.tsx'

//@ts-ignore
let tMock = vi.fn().mockImplementation((str: string) => enJSON[str])
let defaultLanguage = vi.fn().mockReturnValue('en')
let changeLanguageMock = vi.fn().mockImplementation(() => new Promise(() => {}))

vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: tMock,
      i18n: {
        changeLanguage: changeLanguageMock,
        language: defaultLanguage,
      },
    }
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}))

const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

describe('CurrencyConvertor', () => {
  const user = userEvent.setup()
  beforeEach(() => {
    fetchMocker.mockResponse(() => {
      return {
        body: JSON.stringify({ rates: { USD: 1.0854, EUR: 0.92157 } }),
        status: 200,
      }
    })
  })

  afterEach(() => {
    fetchMocker.resetMocks()
  })

  it('should render the app with default values', async () => {
    render(<CurrencyConverter />)

    const baseCurrencySelectBox = screen.getByLabelText('Base Currency')
    const targetCurrencySelectBox = screen.getByLabelText('Target Currency')

    expect(screen.getByText('Currency Converter')).toBeInTheDocument()
    expect(screen.getByText('Base Currency')).toBeInTheDocument()
    expect(screen.getByText('Target Currency')).toBeInTheDocument()
    expect(baseCurrencySelectBox).toHaveValue('EUR')
    expect(targetCurrencySelectBox).toHaveValue('USD')
    expect(await screen.findAllByText('1 EUR = 1.0854 USD')).toHaveLength(2)
  })

  it('should show error message when same currency is selected', async () => {
    render(<CurrencyConverter />)
    const baseCurrencySelectBox = screen.getByLabelText('Base Currency')
    const targetCurrencySelectBox = screen.getByLabelText('Target Currency')
    await user.selectOptions(baseCurrencySelectBox, 'USD')
    await user.selectOptions(targetCurrencySelectBox, 'USD')
    expect(
      await screen.findByText('Base and target currencies must be different.'),
    ).toBeInTheDocument
  })

  it('should show error message when negative amount is entered', async () => {
    render(<CurrencyConverter />)
    const amountInput = screen.getByLabelText('Amount')
    await user.type(amountInput, '{backspace}')
    await user.type(amountInput, '-1')
    await userEvent.tab()
    expect(
      await screen.findByText('Amount must be a non-negative number.'),
    ).toBeInTheDocument()
  })

  it('should show convert the right currencies when the base currency and target currency is changed', async () => {
    fetchMocker.mockResponse(() => {
      return {
        body: JSON.stringify({ rates: { JPY: 154.527, USD: 1 } }),
        status: 200,
      }
    })
    render(<CurrencyConverter />)
    const baseCurrencySelectBox = screen.getByLabelText('Base Currency')
    const targetCurrencySelectBox = screen.getByLabelText('Target Currency')
    await user.selectOptions(targetCurrencySelectBox, 'JPY')
    await user.selectOptions(baseCurrencySelectBox, 'USD')
    expect(baseCurrencySelectBox).toHaveValue('USD')
    expect(targetCurrencySelectBox).toHaveValue('JPY')
    expect(await screen.findAllByText('1 USD = 154.5270 JPY')).toHaveLength(2)
  })

  it('should swap the order of the currencies when the base currency and target currency is changed', async () => {
    render(<CurrencyConverter />)
    const swapButton = screen.getByRole('button')
    const baseCurrencySelectBox = screen.getByLabelText('Base Currency')
    const targetCurrencySelectBox = screen.getByLabelText('Target Currency')
    expect(baseCurrencySelectBox).toHaveValue('EUR')
    expect(targetCurrencySelectBox).toHaveValue('USD')
    await user.click(swapButton)
    expect(baseCurrencySelectBox).toHaveValue('USD')
    expect(targetCurrencySelectBox).toHaveValue('EUR')
    expect(await screen.findAllByText('1 USD = 0.9216 EUR')).toHaveLength(2)
  })

  it('should show convert the right amount when the amount is changed', async () => {
    render(<CurrencyConverter />)
    const amountInput = screen.getByLabelText('Amount')
    await user.type(amountInput, '0')
    await userEvent.tab()
    expect(await screen.findByText('10 EUR = 10.8540 USD')).toBeInTheDocument()
    expect(await screen.findAllByText('1 EUR = 1.0854 USD')).toHaveLength(1)
  })

  it('should show handle errors if API response fails', async () => {
    fetchMocker.mockResponse(() => {
      return {
        body: JSON.stringify({ rates: { JPY: 154.527, USD: 1 } }),
        status: 404,
      }
    })

    render(<CurrencyConverter />)

    expect(
      await screen.findByText(
        'An error occurred while fetching the conversion rate.',
      ),
    ).toBeInTheDocument()
  })

  it('should load the correct value for language switcher and correct language and allow changing language', async () => {
    defaultLanguage = vi.fn().mockReturnValueOnce('de')
    //@ts-ignore
    tMock = vi.fn().mockImplementation((str: string) => deJSON[str])
    render(<CurrencyConverter language="de" />)
    expect(screen.getByText('Währungsumrechner')).toBeInTheDocument()
    const languageSwitcher = screen.getByRole('listbox')
    expect(languageSwitcher).toHaveValue('de')
    await user.selectOptions(languageSwitcher, 'en')
    expect(changeLanguageMock).toHaveBeenCalled()
  })
})
