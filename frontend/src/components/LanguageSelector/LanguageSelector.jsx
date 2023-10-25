import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Inizializza con la lingua corrente

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
  };

  return (
    <div className="languageSelectorBox">
      <button
        onClick={() => changeLanguage('en')}
        className={`languageButton ${selectedLanguage === 'en' ? 'activeLang' : ''}`}
      >
        En
      </button>

      <button
        onClick={() => changeLanguage('fr')}
        className={`languageButton ${selectedLanguage === 'fr' ? 'activeLang' : ''}`}
      >
        It
      </button>
    </div>
  );
}

export default LanguageSelector;