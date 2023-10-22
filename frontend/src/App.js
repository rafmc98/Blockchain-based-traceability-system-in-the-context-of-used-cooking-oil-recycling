import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { React, useState, useEffect } from "react"

import './App.css';

import Home from './components/Home';
import Transporter from './components/Transporter';
import Regenerarion from './components/Regeneration';
import Layout from './components/Layout';
import MetamaskConnection from './components/MetamaskConnection';

import LogoIcon from './LENTE-NEW_Tavola disegno 1.svg';

function App() {

  const [account, setAccount] = useState();
  
  // Define a function to update the account state in Regeneration component
  const updateAccount = (newAccount) => {
      setAccount(newAccount);
  };

  useEffect(() => {
    if(account) console.log("Account connected: ", account);
  }, [account]);
  return (
    <BrowserRouter>
            <div className="header">
                <div className='logo-box'>
                  <img className='logoIcon' src={LogoIcon} alt=''/>
                  <span className='logo'>OilTracker</span>
                  <Layout />
                </div>
                <MetamaskConnection account={account} updateAccount={updateAccount}/>
            </div>
            <Routes>
                  <Route path="/">
                      <Route index element={<Home />} />
                      <Route path="transporter" element={<Transporter account={account}/>} />
                      <Route path="regeneration" element={<Regenerarion/>} />
                  </Route>
            </Routes>
    </BrowserRouter>
  );
}
export default App;
