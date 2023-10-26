import { useTranslation } from 'react-i18next';

import './MetamaskConnection.css';

const MetamaskConnection = ({ account, updateAccount }) => {

    const { t } = useTranslation();
    const user = sessionStorage.getItem('token');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
                const newAccount = accounts[0];
                updateAccount(newAccount);
                sessionStorage.setItem('account', newAccount);

            } catch (error) {
                console.error('Error requesting Ethereum accounts:', error);
                return null;
            }
        } else {
            console.error('Ethereum not detected');
            return null;
        }
    }

    const disconnectWallet = () => {
        updateAccount(null);
        sessionStorage.removeItem('account');
    };

    return (
        <div className="connectionBox">
            { user && 
                <>
                    {!account ? (
                        <button  className='connectionButton' onClick={connectWallet}>{t('connectButton')}</button>    
                    ): (
                        <>
                            <span>{account}</span>
                            <button className='logoutButton' onClick={disconnectWallet}>{t('logoutButton')}</button>
                        </>    
                    )}
                </>
            }
        </div>
    );
};
  
export default MetamaskConnection;