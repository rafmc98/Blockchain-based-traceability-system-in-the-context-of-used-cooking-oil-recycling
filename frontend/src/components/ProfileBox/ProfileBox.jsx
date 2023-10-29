import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';


import LanguageSelector from '../LanguageSelector/LanguageSelector';
import MetamaskConnection from '../MetamaskConnection/MetamaskConnection';


import './ProfileBox.css'

const ProfileBox = () => {

    const { t } = useTranslation();

    const [toggle, setToggle] = useState(false);
    const dropdownRef = useRef(null);

    const user = sessionStorage.getItem("token");

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location.reload();
    };

    useEffect(() => {
        // Aggiungi un event listener al documento per rilevare clic esterni alla tendina
        function handleDocumentClick(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setToggle(false);
        }
        }
    
        document.addEventListener('click', handleDocumentClick);
    
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);
    return (
        <div className='profileBox'>
            <LanguageSelector />
            { user && 
                <div className='dropdown-section' ref={dropdownRef}>
                    <span className={` profileInfo ${toggle ? 'white-background' : ''}`} onClick={() => setToggle(!toggle)}>
                        {t('hello')}{sessionStorage.getItem('name')} 
                        <div className={`${toggle ? 'rotate' : ''}`}>
                            <span className="material-icons">
                                expand_more
                            </span>
                        </div>
                    </span>
                    { toggle && (
                        <div className='dropdown-content' >
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