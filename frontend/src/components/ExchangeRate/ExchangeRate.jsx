import { useEffect, useState } from 'react';
import Web3 from 'web3';

import oilTrackerTokenABI from '../../contractsABI/OIlTrackerTokenABI.json'
import TransactionResponse from '../TransactionResponse/TransactionResponse';
import './ExchangeRate.css';


import { useTranslation } from 'react-i18next';

const ExchangeRate = ({ account }) => {

  const { t } = useTranslation();

  const [web3, setWeb3] = useState(null);
  const [oilTrackerTokenContract, setOilTrackerTokenContract] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rate, setRate] = useState('');
  const [title, setTitle] = useState(null);
  const [showResponse, setShowResponse] = useState(null);
  
  const onChangeRate = (event) => {
    setRate(event.target.value); 
};
  
  const changeRate = async () => {
    try {
      const gasEstimate = await oilTrackerTokenContract.methods.changeExchangeRate(rate).estimateGas({ from: account });
      const myData = await oilTrackerTokenContract.methods.changeExchangeRate(rate).encodeABI();
      const recipient =  process.env.REACT_APP_TOKEN_ADDRESS;
    
      const transaction = await web3.eth.sendTransaction({
        from: account,
        to: recipient,
        gas: gasEstimate,
        data: myData,
      });
    
      setTitle(t('transactionConfirmed'))
      setShowResponse(t('exchangeRateModified'))

      console.log("Transaction Hash: " + transaction.transactionHash);
      
    } catch (error) {
      console.log(error);
    }
  }

  const closeResponseBox = async () => {
    setShowResponse(null);
  }

  useEffect(() => {
      
    const initCertificationNFTContract = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const oilTrackerTokenContract = new web3Instance.eth.Contract(oilTrackerTokenABI, process.env.REACT_APP_TOKEN_ADDRESS);
        setOilTrackerTokenContract(oilTrackerTokenContract);
        console.log(oilTrackerTokenContract);

        let currentExchangeRate = Number(await oilTrackerTokenContract.methods.getExchangeRate().call())
        setExchangeRate(currentExchangeRate);
    };

    initCertificationNFTContract();
  }, []);
  return (
    <>
        { showResponse && <TransactionResponse title={title} message={showResponse}  closeResponseBox={closeResponseBox} /> }

        <span className='sectionTitle changeRateTitle'>{t('changeExchangeRateTitle')}</span>
        <div className='getSequenceForm'>
            <input type='number' value={rate} onChange={onChangeRate} placeholder={t('changeRatePlaceholder')}/>
            <button onClick={changeRate}>{t('getSequenceButton')}</button>
        </div>

        <span className='currentExchangeRate'>
          {t('OTExchangeRate')} : {exchangeRate}
        </span>
        <div className='divider'></div>
    </>
  );
};
  
export default ExchangeRate;