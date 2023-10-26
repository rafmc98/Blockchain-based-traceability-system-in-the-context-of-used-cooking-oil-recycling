import { useTranslation } from 'react-i18next';
import { useState } from 'react';


import LanguageSelector from '../LanguageSelector/LanguageSelector';
import MetamaskConnection from '../MetamaskConnection/MetamaskConnection';


import './ProfileBox.css'

const ProfileBox = () => {

   const { t } = useTranslation();

   const [toggle, setToggle] = useState(false);

   const user = sessionStorage.getItem("token");

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location.reload();
    };
   
   return (
        <div className='profileBox'>
            <LanguageSelector />
            { user && 
                <div className='dropdown-section'>
                    <span className={` profileInfo ${toggle ? 'white-background' : ''}`} onClick={() => setToggle(!toggle)}>
                        {t('hello')}{sessionStorage.getItem('name')} 
                        <div className={`${toggle ? 'rotate' : ''}`}>
                            <span className="material-icons">
                                expand_more
                            </span>
                        </div>
                    </span>
                    { toggle && (
                        <div className='dropdown-content'>
                            <MetamaskConnection />
                            <button onClick={handleLogout} className='logout-button'>
                                {t('logout')}
                            </button>
                        </div>
                    )}
                </div>
            }
        </div>
    );
  };
  
  export default ProfileBox;