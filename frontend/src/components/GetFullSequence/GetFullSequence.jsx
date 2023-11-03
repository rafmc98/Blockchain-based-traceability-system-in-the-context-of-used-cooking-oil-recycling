import { useState } from 'react';
import Web3 from 'web3';

import './GetFullSequence.css'

import GetPdf from '../GetPdf' 

import firstContractABI from '../../contracts/FirstWIfCidStorageABI.json';
import secondContractABI from '../../contracts/SecondWifCidStorageABI.json';
import { useTranslation } from 'react-i18next';
import GetXml from '../GetXml';

const GetFullSequence = () => {

    const { t } = useTranslation();

    const [cidSequence, setCidSequence] = useState([]);
    const [rfjSequence, setRfjSequence] = useState([]);
    const [rfj, setRfj] = useState('');

    const onRfjChange = (event) => {
        setRfj(event.target.value); 
    };

    const getFullSequence = async () => {
        const web3 = new Web3(window.ethereum);
        const firstContract = new web3.eth.Contract(firstContractABI, process.env.REACT_APP_FIRST_CONTRACT_ADDRESS);
        const secondContract = new web3.eth.Contract(secondContractABI, process.env.REACT_APP_SECOND_CONTRACT_ADDRESS);
        
        const rfjObj = await getRfjInfo(firstContract, secondContract);

        const index = rfjObj[0];
        const cid = rfjObj[1];
        const resultRfj = rfjObj[2];

        let tempCidSequence = new Array(3);
        let tempRfjSequence = new Array(3);

        switch (index) {
            case 1:
                tempCidSequence[0] = cid
                tempRfjSequence[0] = rfj
                const secondRfj = await secondContract.methods.getNextRfj(rfj).call()
                if (secondRfj) { 
                    const result = await secondContract.methods.getWifInfo(secondRfj).call()
                    tempCidSequence[1] = result[1]
                    tempRfjSequence[1] = secondRfj
                }
                break;
            case 2:
                tempCidSequence[1] = cid
                tempRfjSequence[1] = rfj
                tempCidSequence[0] = await firstContract.methods.getWifInfo(resultRfj).call()
                tempRfjSequence[0] = resultRfj
              break;
            default:
                console.log("Il codice Rfj non esiste");
        }
        console.log(tempCidSequence)
        console.log(tempRfjSequence)
        setCidSequence(tempCidSequence);
        setRfjSequence(tempRfjSequence);
    }
    
    const getRfjInfo = async (firstContract, secondContract) => {
        let result = await firstContract.methods.getWifInfo(rfj).call();
        if (result) { return [1, result, null] }

        result = await secondContract.methods.getWifInfo(rfj).call();
        if (result[0] !== '') { return [2, result[1], result[0]] }
        else { alert("Il codice Rfj non corrisponde ad alcun documento memorizzato")}

        return [-1, null, null]
    }

    const renderSequence = cidSequence.map((cid, index) => (
        <tr key={index}>
            <td>{rfjSequence[index]}</td>
            <td name="cid">
                <a href={`https://ipfs.io/ipfs/${cid}`}>{cid}</a>
            </td>
            <td><GetPdf cid={cid}/></td>
            <td><GetXml cid={cid}/></td>
        </tr>
    ))
   
    return (
        <div className='getSequenceContainer'>
            <span className='sectionTitle'>{t('getSequenceTitle')}</span>
            <div className='getSequenceForm'>
                <input type='text' value={rfj} onChange={onRfjChange} placeholder={t('getWifPlaceholder')}/>
                <button onClick={getFullSequence}>{t('getSequenceButton')}</button>
            </div>
            {cidSequence[0] && (
                <table>
                <thead>
                    <tr>
                        <th>ID DOC</th>
                        <th>CID</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {renderSequence}
                </tbody>
            </table>
            )}
        </div>
    );
  };
  
  export default GetFullSequence;