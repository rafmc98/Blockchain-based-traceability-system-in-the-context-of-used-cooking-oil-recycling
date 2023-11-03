import './Admin.css';
import GetFullSequence from '../GetFullSequence/GetFullSequence';
import ConnectWalletDisclaimer from '../ConnectWalletDisclaimer/ConnectWalletDisclaimer';


const Admin = () => {
   
    const account = sessionStorage.getItem('account');

    return (
        <>
            {!account ? (
                <ConnectWalletDisclaimer />
            ) : (
                <div className='admin-container'>
                    <GetFullSequence/>
                </div>
            )}
        </>
    );
};

export default Admin;