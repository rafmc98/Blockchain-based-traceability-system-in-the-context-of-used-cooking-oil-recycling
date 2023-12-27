import './Admin.css';
import GetFullSequence from '../GetFullSequence/GetFullSequence';
import ConnectWalletDisclaimer from '../ConnectWalletDisclaimer/ConnectWalletDisclaimer';
import ExchangeRate from '../ExchangeRate/ExchangeRate';

const Admin = () => {
   
    const account = sessionStorage.getItem('account');

    return (
        <>
            {!account ? (
                <ConnectWalletDisclaimer />
            ) : (
                <div className='admin-container'>
                    <ExchangeRate account={account}/>
                    <GetFullSequence/>
                </div>                
            )}
        </>
    );
};

export default Admin;