import { Route, Routes, Navigate } from 'react-router-dom';
import { React, useState, useEffect } from "react"

import './App.css';

import Home from './components/Home/Home';
import Transporter from './components/Transporter/Transporter';
import Regeneration from './components/Regeneration/Regeneration';
import Layout from './components/Layout/Layout';
import ProfileBox from './components/ProfileBox/ProfileBox';


import SignUp from './components/SignUp/SignUp';
import LogIn from './components/LogIn/LogIn';
import LogoIcon from './assets/images/LENTE_Tavola disegno 1.svg';

function App() {

  const [account, setAccount] = useState();

  const user = sessionStorage.getItem("token");
  
  // Define a function to update the account state in Regeneration component
  const updateAccount = (newAccount) => {
      setAccount(newAccount);
  };

  useEffect(() => {
    if(account) console.log("Account connected: ", account);
  }, [account]);
  return (
    <>
      <div className="header">
          <div className='logo-box'>
            <img className='logoIcon' src={LogoIcon} alt=''/>
            <span className='logo'>OilTracker</span>
            <Layout />
          </div>
          <ProfileBox account={account} updateAccount={updateAccount}/>
      </div>
      
      <Routes>
        {user && 
          <>
            <Route path="/" exact element={<Home />} />
            <Route path="/transporter" element={<Transporter account={account} updateAccount={updateAccount}/>} />
            <Route path="/regeneration" element={<Regeneration/>} />
          </>
        }
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/login" exact element={<LogIn />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/transporter" element={<Navigate replace to="/login" />} />
        <Route path="/regeneration" element={<Navigate replace to="/login" />} />
        </Routes>
    </>
  );
}
export default App;
