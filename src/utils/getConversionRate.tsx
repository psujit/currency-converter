export const getConversionRate = async (
  from: string,
  to: string,
  setErrorMessage: (message: string) => void,
) => {
  setErrorMessage('')
  const host = 'api.frankfurter.app'
  try {
    const response = await fetch(
      `https://${host}/latest?amount=1&from=${from}&to=${to}`,
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const conversionRate = await response.json()
    return Number(conversionRate.rates[to])
  } catch (error) {
    setErrorMessage('An error occurred while fetching the conversion rate.')
    console.error(error)
    return 1
  }
}
