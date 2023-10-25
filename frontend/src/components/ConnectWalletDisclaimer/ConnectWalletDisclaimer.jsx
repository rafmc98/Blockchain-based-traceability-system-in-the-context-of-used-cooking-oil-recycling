import { useTranslation } from 'react-i18next';
import metamasklogo from '../../assets/images/metamasklogo.webp'
import './ConnectWalletDisclaimer.css'

const ConnectWalletDisclaimer = () => {

  const { t } = useTranslation();
    
  return (
    <>
      <div className='connect-wallet-info-box'>
          <img id='metamaskLogo' src={metamasklogo} alt='response'/>
          <span className='messageBox'>{t("connect")}</span>
      </div>
    </>
  );
};
  
export default ConnectWalletDisclaimer;