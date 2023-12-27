import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Transporter.css';

import UploadFile from '../UploadFile/UploadFile';
import Oracle from '../Oracle/Oracle';
import FirForm from '../FirForm/FirForm';
import ConnectWalletDisclaimer from '../ConnectWalletDisclaimer/ConnectWalletDisclaimer';

const Transporter = () => {

  const { t } = useTranslation();
  const account = sessionStorage.getItem('account');
  

  const [document, setDocument] = useState(null);
  const [prevRfj, setPrevRfj] = useState('');

  const updateDocument = (newFileToUpload) => {
    setDocument(newFileToUpload);
    console.log(process.env.REACT_APP_ENCRYPTION_PUBLIC_KEY)
    console.log("Document uploaded");
  }

  const handleInputChange = (event) => {
    setPrevRfj(event.target.value); 
  }; 

  return (
    <>
      {!account ? (
        <ConnectWalletDisclaimer />
      ) : (
        
          <div className='transporter-container'>
            <div className='interactionContainer'>

              <div className="interactionBox">
                <span>{t('prevIdDocDescritpion')}</span>
                <input className="prevIdDocument" type='text' placeholder={t('setPrevRfjPlaceholder')} value={prevRfj} onChange={handleInputChange}/>
                <span className='sectionTitle'>{t('upload')}</span>
                <UploadFile updateFileToUpload={updateDocument}/>
                <Oracle 
                  fileToUpload={document}
                  prevRfj={prevRfj}
                  t={t}
                />
              </div>
            </div>

            <div className='divider'>
              <span className='divider-text'>
                {t('otherwise')}
              </span>
            </div>
            <span className='sectionTitle'>{t('enterManually')}</span>
            <FirForm 
              prevRfj={prevRfj}
              t={t} 
            />
          </div>
      )}
    </>
  );
};
  
export default Transporter;