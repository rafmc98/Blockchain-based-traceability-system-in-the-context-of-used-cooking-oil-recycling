import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Regeneration.css';

import ConnectWalletDisclaimer from '../ConnectWalletDisclaimer/ConnectWalletDisclaimer';
import UploadFile from '../UploadFile/UploadFile';
import RegenerationOracle from '../RegenerationOracle/RegenerationOracle';
import RegenerationDocForm from '../RegenerationDocForm/RegenerationDocForm';

const Regenerarion = () => {
   
    const account = sessionStorage.getItem('account');
    const { t } = useTranslation();
    
    const [document, setDocument] = useState(null);
    const [prevRfj, setPrevRfj] = useState('');

    const updateDocument = (newFileToUpload) => {
        setDocument(newFileToUpload);
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
            <div className="regeneration-container">
                <span>{t('prevIdDoc')}</span>
                <input className="prevIdDocument" type='text' placeholder={t('setPrevRfjPlaceholder')} value={prevRfj} onChange={handleInputChange}/>
                <span className='sectionTitle'>{t('upload-transport')}</span>
                <UploadFile updateFileToUpload={updateDocument}/>
                <RegenerationOracle 
                    fileToUpload={document}
                    prevRfj={prevRfj}
                    t={t}
                />

                <div className='divider'>
                    <span className='divider-text'>
                        {t('otherwise')}
                    </span>
                </div>
                <span className='sectionTitle'>{t('enterManually')}</span>
                <RegenerationDocForm 
                    prevRfj={prevRfj}
                    t={t} 
                />
            </div>
        )}
        </>
    );
  };
  
  export default Regenerarion;