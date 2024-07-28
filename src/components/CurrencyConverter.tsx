import { useTranslation } from 'react-i18next'
import { currencies } from '../utils/currencies.ts'
import { ChangeEvent, useEffect, useState } from 'react'
import { getConversionRate } from '../utils/getConversionRate.tsx'
import reloadIcon from '../assets/reload_icon.png'
import styles from './CurrencyConverter.css?inline'
import { LanguageSwitcher } from './LanguageSwitcher.tsx'

export interface CurrencyConverterProps {
  baseAmount?: string
  baseCurrency?: string
  language?: 'en' | 'de' | 'it'
  languageSwitcher?: boolean
  targetCurrency?: string
  toolOrientation?: 'horizontal' | 'vertical'
}

export const CurrencyConverter = (props: CurrencyConverterProps) => {
  const {
    baseAmount = '1',
    baseCurrency = 'EUR',
    language = 'en',
    languageSwitcher = true,
    targetCurrency = 'USD',
    toolOrientation = 'horizontal',
  } = props
  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation()
  const [sourceCurrency, setSourceCurrency] = useState<string>(baseCurrency)
  const [convertedCurrency, setConvertedCurrency] =
    useState<string>(targetCurrency)
  const [sourceAmount, setSourceAmount] = useState<string>(baseAmount)
  const [targetAmount, setTargetAmount] = useState(0)
  const [conversionRate, setConversionRate] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    changeLanguage(language)
  }, [])

  useEffect(() => {
    const getRates = async () => {
      const rate = await getConversionRate(
        sourceCurrency,
        convertedCurrency,
        setErrorMessage,
      )
      setTargetAmount(rate * Number(sourceAmount))
      setConversionRate(rate)
    }
    if (validateNonNegativeFloat(sourceAmount)) {
      setValidationError('')
      errorMessage.length === 0 && getRates()
    } else {
      setValidationError(t('validationError'))
    }
  }, [sourceCurrency, convertedCurrency, sourceAmount])

  const handleSourceCurrencyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setErrorMessage('')
    if (event.target.value === convertedCurrency) {
      setErrorMessage(t('sameCurrencyError'))
    }
    setSourceCurrency(event.target.value)
  }

  const handleTargetCurrencyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setErrorMessage('')
    if (event.target.value === sourceCurrency) {
      setErrorMessage(t('sameCurrencyError'))
    }
    setConvertedCurrency(event.target.value)
  }

  const validateNonNegativeFloat = (value: string): boolean => {
    const floatValue = Number(value)
    return value.length > 0 && !isNaN(floatValue) && floatValue >= 0
  }

  const handleSourceAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSourceAmount(value)
  }

  const swapCurrencies = () => {
    setSourceCurrency(convertedCurrency)
    setConvertedCurrency(sourceCurrency)
  }

  return (
    <>
      <style>{styles}</style>
      <main className={`${toolOrientation === 'vertical' ? 'vertical' : ''}`}>
        <div className="container">
          {languageSwitcher && <LanguageSwitcher />}
          <h2>{t('title')}</h2>
          <div className="item">
            <span>
              <label htmlFor="amount">{t('amount')}</label>
              <input
                id="amount"
                type="text"
                maxLength={20}
                value={sourceAmount}
                onChange={handleSourceAmountChange}
              />
            </span>
          </div>
          <div className="item">
            <label htmlFor="source-currency">{t('base')}</label>
            <select
              id="source-currency"
              value={sourceCurrency}
              onChange={handleSourceCurrencyChange}
            >
              {Object.keys(currencies).map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {/*@ts-expect-error indexing a JSON Object using strings*/}
                  {`${currencyCode} - ${currencies[currencyCode]}`}
                </option>
              ))}
            </select>
          </div>
          <button className="item" onClick={swapCurrencies}>
            <img src={`${reloadIcon}`} alt="Swap currencies" />
          </button>
          <div className="item">
            <label htmlFor="target-currency">{t('target')}</label>
            <select
              id="target-currency"
              value={convertedCurrency}
              onChange={handleTargetCurrencyChange}
            >
              {Object.keys(currencies).map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {/*@ts-expect-error indexing a JSON Object using strings*/}
                  {`${currencyCode} - ${currencies[currencyCode]}`}
                </option>
              ))}
            </select>
          </div>
          <div className="item">
            {validationError.length > 0 && (
              <p className="error validation">{validationError}</p>
            )}
          </div>
          {errorMessage.length > 0 && (
            <div className="item stretch error">{errorMessage}</div>
          )}
          <span className="item stretch">
            {validateNonNegativeFloat(sourceAmount) &&
              errorMessage.length === 0 && (
                <>
                  <h4>{t('convertedAmount')}</h4>
                  <p>
                    {sourceAmount} {sourceCurrency} = {targetAmount.toFixed(4)}{' '}
                    {convertedCurrency}
                  </p>
                </>
              )}
            <br />
            <h4>{t('conversionRates')}</h4>
            <label>
              1 {sourceCurrency} = {conversionRate.toFixed(4)}{' '}
              {convertedCurrency}
            </label>
            <label>
              1 {convertedCurrency} = {(1 / conversionRate).toFixed(4)}{' '}
              {sourceCurrency}
            </label>
          </span>
        </div>
      </main>
    </>
  )
}
