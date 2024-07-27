import ReactDOM from 'react-dom/client'
import {
  CurrencyConverter,
  CurrencyConverterProps,
} from './components/CurrencyConverter.tsx'
import { normalizeAttribute } from './utils/convertToWebComponentUtils.ts'

class CurrencyConverterWebComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes<CurrencyConverterProps>()
    const root = ReactDOM.createRoot(this.shadowRoot as ShadowRoot)
    root.render(<CurrencyConverter {...props} />)
  }

  private getPropsFromAttributes<T>(): T {
    const props: Record<string, string> = {}

    for (let index = 0; index < this.attributes.length; index++) {
      const attribute = this.attributes[index]
      props[normalizeAttribute(attribute.name)] = attribute.value
    }

    return props as T
  }
}

export default CurrencyConverterWebComponent
