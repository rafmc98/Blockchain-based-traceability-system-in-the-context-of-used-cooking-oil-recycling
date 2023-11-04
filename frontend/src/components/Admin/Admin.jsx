import './Admin.css';
import GetFullSequence from '../GetFullSequence/GetFullSequence';
import ConnectWalletDisclaimer from '../ConnectWalletDisclaimer/ConnectWalletDisclaimer';
import Crypto from '../Crypto';
import Codifica from '../Codifica';
import Encrypter from '../Encrypter';

const Admin = () => {
   
    const account = sessionStorage.getItem('account');

    return (
        <>
            {!account ? (
                <ConnectWalletDisclaimer />
            ) : (
                <div className='admin-container'>
                    <Codifica/>
                    <GetFullSequence/>
                </div>                
            )}
        </>
    );
};

export default Admin;