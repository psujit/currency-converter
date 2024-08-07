# Currency Converter
Currency Converter Tool that can be integrated into an HTML page.

## Table of Contents
- [General Information](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Constraints](#constraints)
- [Validations](#validations)

## General Information
- This is a tool to convert currency from one to another.
- User can select the base currency and target currency and the amount to convert.
- The result will be displayed below the fields.
- The user can also see the exchange rate used for the conversion and the reverse exchange rate.
- The tool uses the [Frankfurter App](https://www.frankfurter.app/) to get the latest exchange rates provided by the European Central Bank.
- This tool can be integrated directly into an HTML page.

## Technologies Used

- HTML

- React

- TypeScript

- i18next

- Vite

- Vitest

- React Testing Library


## Features

- Convert Currency

- The currencies are alphabetically sorted in the dropdown.

- The most common currencies according to the requirements are displayed alphabetically at the top for ease of use.

- The other supported currencies are displayed alphabetically underneath the most common currencies.

- The built version can be integrated into an HTML page.

- The styles are responsive and can be used on any device.

- The styles of the tool can be controlled by the host application.

- The tool can be used in a light or dark mode that is controlled by the current system setting of the user (the one running on the dev server has a better difference in this case than the production build but that is only for demo purposes).

- The tool can be used in a vertical or horizontal orientation that can be controlled by the host application.

- The language of the tool can also be controlled by the host application (defaults to English if language is not provided).

## Configuration
- Used Prettier for maintaining formatting style of code.


## Setup
This project was bootstrapped using [Vite](https://vitejs.dev/).

### Steps
- The project can be cloned using
```sh
git clone https://github.com/psujit/currency-converter.git
```

- To install the dependencies, use
```sh
cd currency-converter
npm install
```

- Once the dependencies are installed, the application can be run using
```sh
npm run dev
```
- The application will run on http://localhost:5173/

## Build
- To build the application, use
```sh
npm run build
```
- The build will be created in the `dist` folder.
- The build can be served using
```sh
npm run preview
```
- The build will be served on http://localhost:4173/
- This built version is using a web component to integrate the currency converter into an HTML page.
- The web component is integrated in the `index.html` file in the `public` folder.

## Testing
- The app is tested using [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- To run the tests, use
```sh
npm run test
```
- To run the tests with coverage, use
```sh
npm run test:coverage 
```

## Constraints

- The currency converter only supports the currencies provided by the European Central Bank.
- The currency converter limits precision to four decimal places due to the peculiar way JavaScript handles arithmetic with floating point numbers.
- Only "." is allowed as a decimal separator.

## Validations

- The input amount can be a non-negative number.
- The Base and Target currencies must not be the same.