import { useEffect, useState } from 'react';
import Web3 from 'web3';

import certificationNFTABI from '../../contractsABI/CertificationNFTABI.json';
import oilTrackerTokenABI from '../../contractsABI/OIlTrackerTokenABI.json'
import TransactionResponse from '../TransactionResponse/TransactionResponse';

import { useTranslation } from 'react-i18next';

const RewardSystem = ({ account }) => {

  const { t } = useTranslation();

  const [web3, setWeb3] = useState(null);
  const [oilTrackerTokenContract, setOilTrackerTokenContract] = useState(null);
  const [userNFTs, setUserNFTs] = useState(new Map());
  const [exchangeRate, setExchangeRate] = useState(null);
  const [title, setTitle] = useState(null);
  const [showResponse, setShowResponse] = useState(null);
  const [OTBalance, setOTBalance] = useState(null);
  

  const fetchUserNFTs = async (contract) => {
    let accountBalance =  await contract.methods.balanceOf(account).call()
    accountBalance = Number(accountBalance)
    console.log(`Account balance :  ${accountBalance}`)

    let counter = 0
    while (true) {
      if (accountBalance === 0) { break }
      let owner = await contract.methods.ownerOf(counter).call()
      if (owner.toLowerCase() === account) {
        let validity = await contract.methods.getNFTValidity(counter).call()
        console.log(validity)
        let newMap = new Map(userNFTs)
        newMap.set(counter, validity)
        setUserNFTs(newMap)
      }

      counter += 1
      accountBalance -= 1
    }
    console.log(userNFTs);
  };

  const getOt = async (nftId) => {
    try {
      const gasEstimate = await oilTrackerTokenContract.methods.mintToken(nftId).estimateGas({ from: account });
      const myData = await oilTrackerTokenContract.methods.mintToken(nftId).encodeABI();
      const recipient =  process.env.REACT_APP_TOKEN_ADDRESS;
    
      const transaction = await web3.eth.sendTransaction({
        from: account,
        to: recipient,
        gas: gasEstimate,
        data: myData,
      });
    
      setTitle(t('transactionConfirmed'))
      setShowResponse(t('OTCoinReceived'))

      console.log("Transaction Hash: " + transaction.transactionHash);
      
    } catch (error) {
      console.log(error);
    }
  }

  const renderUserNFTs = Array.from(userNFTs).map(([key, value]) => (
    <tr key={key}>
        <td>{key}</td>
        <td>{value.toString()}</td>
        <td><button onClick={() => getOt(key)}>{t('getOTs')}</button></td>
    </tr>
  ))

  const closeResponseBox = async () => {
    setShowResponse(null);
  }

  useEffect(() => {
      
    const initCertificationNFTContract = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const certificationNFTContract = new web3Instance.eth.Contract(certificationNFTABI, process.env.REACT_APP_CERTIFICATION_ADDRESS);
      
        const oilTrackerTokenContract = new web3Instance.eth.Contract(oilTrackerTokenABI, process.env.REACT_APP_TOKEN_ADDRESS);
        setOilTrackerTokenContract(oilTrackerTokenContract);
        console.log(oilTrackerTokenContract);

        fetchUserNFTs(certificationNFTContract);

        let currentExchangeRate = Number(await oilTrackerTokenContract.methods.getExchangeRate().call())
        setExchangeRate(currentExchangeRate);

        let currentOTBalance = await oilTrackerTokenContract.methods.balanceOf(account).call()
        setOTBalance(Number(currentOTBalance)/ 10 ** 18);
        
    };

    initCertificationNFTContract();
  }, []);
  return (
    <>
      { showResponse && <TransactionResponse title={title} message={showResponse}  closeResponseBox={closeResponseBox} /> }

      {userNFTs.size > 0 && (
        <>
          <span className='sectionTitle'>{t('nftOverview')}</span>
          <table className='nftTable'>
              <thead>
                  <tr>
                      <th>Id</th>
                      <th>{t('validity')}</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {renderUserNFTs}
              </tbody>
          </table>
          <span className='exchangeRate'>
            {t('OTExchangeRate')} : {exchangeRate}
          </span>

        </>
      )}

      {OTBalance > 0 && 
        <>
          <div className='divider-nft'></div>

          <span className='sectionTitle'>{t('OTCoinOverview')}</span>

          <span>{OTBalance} OT</span>

          <div className='divider-nft'></div>
        </>
      }
    </>
  );
};
  
export default RewardSystem;