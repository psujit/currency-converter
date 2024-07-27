import { useTranslation } from 'react-i18next'
import { ChangeEvent, useState } from 'react'

export const LanguageSwitcher = () => {
  const {
    i18n: { language, changeLanguage },
  } = useTranslation()

  const [currentLanguage, setCurrentLanguage] = useState(language)

  const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value
    setCurrentLanguage(newLanguage)
    changeLanguage(newLanguage)
  }

  return (
    <div className="language-switcher">
      <div className="item">
        <select
          role="listbox"
          id="language-selector"
          onChange={handleChangeLanguage}
          value={currentLanguage}
        >
          <option value="en">🇬🇧󠁿 EN</option>
          <option value="de">🇩🇪 DE</option>
          <option value="it">🇮🇹 IT</option>
        </select>
      </div>
    </div>
  )
}
