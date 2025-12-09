import { useTranslation } from 'react-i18next'

function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('flute-calc-language', lang)
  }

  return (
    <div className="language-selector">
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
        title="English"
      >
        🇬🇧
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={i18n.language === 'fr' ? 'active' : ''}
        title="Français"
      >
        🇫🇷
      </button>
    </div>
  )
}

export default LanguageSelector
