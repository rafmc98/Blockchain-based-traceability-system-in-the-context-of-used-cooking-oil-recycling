import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Web3 from 'web3';
import { ipfsHandler } from '../IpfsHandler/ipfsHandler';

import thirdContractABI from '../../contractsABI/ThirdRegenerationCidStorageABI.json';


import TransactionResponse from '../TransactionResponse/TransactionResponse';

class RegenerationOracle extends Component {

  constructor(props) {
    super(props);

    // Initialize properties in the constructor
    this.state = {
      thirdAbi: thirdContractABI,
      onChainAddress: process.env.REACT_APP_THIRD_CONTRACT_ADDRESS,
      account: sessionStorage.getItem('account'),
      fileToUpload: props.fileToUpload,
      prevRfj: props.prevRfj,
      title: "",
      showResponse: "",
    };

    // Serve per bindare le funzioni che fanno parte di questa classe
    this.storeWifCid = this.storeWifCid.bind(this);
    this.checkBalance = this.checkBalance.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.closeResponseBox = this.closeResponseBox.bind(this);
  }

  async componentDidMount() {
    this.updateProps(this.props.fileToUpload, this.props.prevRfj);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.fileToUpload !== prevProps.fileToUpload || this.props.prevRfj !== prevProps.prevRfj) {
      this.updateProps(this.props.fileToUpload, this.props.prevRfj);
    }
  }

  updateProps(newFileToUpload, newPrevRfj) {
    this.setState({ 
      fileToUpload: newFileToUpload,
      prevRfj: newPrevRfj
    });
  }

  async storeWifCid() {

    const web3 = new Web3(window.ethereum);
    
    const contract = new web3.eth.Contract(this.state.thirdAbi, this.state.onChainAddress);

    const balanceResult = await this.checkBalance(web3, contract); 
    if(balanceResult !== undefined) {
      if (!balanceResult) {
        this.setState({
          title: this.props.t('transactionFailed'),
          showResponse: this.props.t('insufficientBalance')
        });
        console.log('Insufficient balance to cover gas cost');
        return
      } else {
        console.log('Sufficient balance to cover gas cost');
      } 
    } else return
    
    const result = await ipfsHandler.storeWif(this.state.fileToUpload);

    const ipfsCid = result.ipfsCid;
    const rfj = result.rfj;
    
    try {
  
      let gasManual = 2000000;
      
      const myData = contract.methods.addRegenerationCid(this.state.prevRfj, ipfsCid, rfj).encodeABI();
      const recipient = this.state.onChainAddress;        

      const transaction = await web3.eth.sendTransaction({
        from: this.state.account,
        to: recipient,
        gas: gasManual,
        data: myData,
      });

      console.log("Transaction Hash: " + transaction.transactionHash);
      
      this.setState({
        title: this.props.t('transactionConfirmed'),
        showResponse: this.props.t('RegenerationCidStored')
      });

      this.setState({
        fileToUpload: null
      })

    } catch (error) {
      console.log(error);
      this.setState({
        title: this.props.t('transactionFailed'),
        showResponse: error.data.message
      });
    }  
  }

  async checkBalance(web3, contract) {
    try {

      // Get the balance of the sender's account in Wei
      const balanceWei = await web3.eth.getBalance(this.state.account);
  
      // Convert the balance from Wei to Ether
      const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
  
      console.log('Checking balance of sender');
      console.log(`Balance of sender ${this.state.account}: ${balanceEther} ETH`);
  
      const placeholderCid = 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH';
      const placeholderRfj = 'abcdefg/yy';

      const gasEstimate = await contract.methods.addRegenerationCid(this.state.prevRfj, placeholderCid, placeholderRfj).estimateGas({
          from: this.state.account
      });
    
      console.log(`Gas estimate for the contract interaction: ${gasEstimate}`);
  
      const gasPriceWei = await web3.eth.getGasPrice();
      const gasCostWei = gasEstimate * gasPriceWei;
  
      return balanceWei >= gasCostWei;
    } catch (error) {
      this.setState({
        title: this.props.t('transactionFailed'),
        showResponse: error.data.message
      });
    }
  }

  async submitHandler(event) {
    event.preventDefault();
    const form = event.target;
    const rfj = form[0].value;
    await this.getWifCid(rfj);
  }

  closeResponseBox() {
    this.setState({
      showResponse: null
    });
  }
 
  render() {

    const { t } = this.props;

    return (
      <div className='oracleBox'>
        { this.state.showResponse && <TransactionResponse title={this.state.title} message={this.state.showResponse}  closeResponseBox={this.closeResponseBox} /> }
        { (this.state.fileToUpload && this.state.prevRfj) && 
          <button className='storeButton' onClick={this.storeWifCid}>{t('storeWif')}</button>
        }
      </div>
    );
  }
}

export default withTranslation()(RegenerationOracle);