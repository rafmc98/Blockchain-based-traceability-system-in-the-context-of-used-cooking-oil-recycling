import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Web3 from 'web3';
import { ipfsHandler } from '../IpfsHandler/ipfsHandler';

import firstContractABI from '../../contractsABI/FirstWIfCidStorageABI.json';
import secondContractABI from '../../contractsABI/SecondWifCidStorageABI.json';

import './Oracle.css';

import TransactionResponse from '../TransactionResponse/TransactionResponse';

class Oracle extends Component {

  constructor(props) {
    super(props);

    // Initialize properties in the constructor
    this.state = {
      firstAbi: firstContractABI,
      secondAbi: secondContractABI,
      firstOnChainAddress: process.env.REACT_APP_FIRST_CONTRACT_ADDRESS,
      secondOnChainAddress: process.env.REACT_APP_SECOND_CONTRACT_ADDRESS,
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
      let contract = null;
      if (!this.state.prevRfj) {
        contract = new web3.eth.Contract(this.state.firstAbi, this.state.firstOnChainAddress);
      } else {
        contract = new web3.eth.Contract(this.state.secondAbi, this.state.secondOnChainAddress);
      }

      console.log(contract);

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
        let myData = null;
        let recipient = null;
        let gasManual = 2000000;
      
        if (!this.state.prevRfj) {
          myData = contract.methods.addWifCid(ipfsCid, rfj).encodeABI();
          recipient = this.state.firstOnChainAddress;
        } else {
          myData = contract.methods.addWifCid(this.state.prevRfj, ipfsCid, rfj).encodeABI();
          recipient = this.state.secondOnChainAddress;
        }
      
        const transaction = await web3.eth.sendTransaction({
          from: this.state.account,
          to: recipient,
          gas: gasManual,
          data: myData,
        });
      
        console.log("Transaction Hash: " + transaction.transactionHash);
      
        this.setState({
          title: this.props.t('transactionConfirmed'),
          showResponse: this.props.t('wifCidStored'),
        });
      
        this.setState({
          fileToUpload: null,
        });
      } catch (error) {
        console.log(error);
        this.setState({
          title: this.props.t('transactionFailed'),
          showResponse: error.data.message,
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

      let gasEstimate = null;

      // check per quale contratto chiamare
      if (!this.state.prevRfj) {
        gasEstimate = await contract.methods.addWifCid(placeholderCid, placeholderRfj).estimateGas({
          from: this.state.account
        });
      } else {
        gasEstimate = await contract.methods.addWifCid(this.state.prevRfj, placeholderCid, placeholderRfj).estimateGas({
          from: this.state.account
        });
      }
  
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
        { this.state.fileToUpload && 
          <button className='storeButton' onClick={this.storeWifCid}>{t('storeWif')}</button>
        }
      </div>
    );
  }
}

export default withTranslation()(Oracle);