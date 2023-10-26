import { useTranslation } from 'react-i18next';

import './MetamaskConnection.css';

const MetamaskConnection = () => {

    const { t } = useTranslation();
    const user = sessionStorage.getItem('token');
    const account = sessionStorage.getItem('account');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
                const newAccount = accounts[0];
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
        sessionStorage.removeItem('account');
        window.location.reload();
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
                            <button className='logoutButton' onClick={disconnectWallet}>{t('disconnectButton')}</button>
                        </>    
                    )}
                </>
            }
        </div>
    );
};
  
export default MetamaskConnection;