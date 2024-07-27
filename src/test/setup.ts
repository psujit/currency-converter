import '@testing-library/jest-dom'

// Need to add this to avoid Test Logs with the following error:
// Error: Could not parse CSS stylesheet
// Caused by a CSS Parser issue in JSDOM
// Source: https://github.com/jsdom/jsdom/issues/2177#issuecomment-376139329
const originalConsoleError = console.error
console.error = function (...data) {
  if (
    typeof data[0]?.toString === 'function' &&
    data[0].toString().includes('Error: Could not parse CSS stylesheet')
  )
    return
  originalConsoleError(...data)
}
