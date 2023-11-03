import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Transporter.css';

import UploadFile from '../UploadFile/UploadFile';
import Oracle from '../Oracle/Oracle';
import FirForm from '../FirForm/FirForm';
import ConnectWalletDisclaimer from '../ConnectWalletDisclaimer/ConnectWalletDisclaimer';

import firstContractABI from '../../contracts/FirstWIfCidStorageABI.json';
import secondContractABI from '../../contracts/SecondWifCidStorageABI.json';

const Transporter = () => {

  const { t } = useTranslation();
  const account = sessionStorage.getItem('account');
  
  const [firstWif, setFirstWif] = useState(null);
  const [secondWif, setSecondWif] = useState(null); 

  const [document, setDocument] = useState(null);
  const [prevRfj, setPrevRfj] = useState('');


  const updateFirstWif = (newFileToUpload) => {
    setFirstWif(newFileToUpload);
    console.log("First wif uploaded");
  }

  const updateDocument = (newFileToUpload) => {
    setDocument(newFileToUpload);
    console.log("Document uploaded");
  }

  const updateSecondWif = (newFileToUpload) => {
    setSecondWif(newFileToUpload);
    console.log("First wif uploaded");
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

              {/*<div className="interactionBox">
                <span className='sectionTitle'>{t('uploadFirst')}</span>
                <div className='uploadBox'>
                  <UploadFile updateFileToUpload={updateFirstWif}/>
                </div>
                <Oracle 
                  contractABI={firstContractABI} 
                  onChainAddress={process.env.REACT_APP_FIRST_CONTRACT_ADDRESS}
                  account={account}
                  networkRPC={"https://polygon-mumbai.infura.io/v3/" + process.env.REACT_APP_POLYGON_API_KEY}
                  fileToUpload={firstWif}
                />
              </div>*/}

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

            {/*<Encrypter />*/}
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