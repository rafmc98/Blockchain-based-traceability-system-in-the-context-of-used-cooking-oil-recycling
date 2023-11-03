import { useTranslation } from 'react-i18next';

import './Home.css'

const Home = () => {

   const { t } = useTranslation();
   
   return (
       <div className='home-container'>
            <div className="welcome-message">{t('welcome')}</div>
            <div className="description">
               {t('about')}
            </div>
       </div>
    );
  };
  
  export default Home;