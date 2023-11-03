import { Route, Routes, Navigate } from 'react-router-dom';
import { React } from "react"

import './App.css';

import Home from './components/Home/Home';
import Transporter from './components/Transporter/Transporter';
import Regeneration from './components/Regeneration/Regeneration';
import Admin from './components/Admin/Admin';
import Layout from './components/Layout/Layout';
import ProfileBox from './components/ProfileBox/ProfileBox';
import SignUp from './components/SignUp/SignUp';
import LogIn from './components/LogIn/LogIn';
import LogoIcon from './assets/images/LENTE_Tavola disegno 1.svg';
import { useTranslation } from 'react-i18next';

function App() {

  const { t } = useTranslation();
  
  const user = sessionStorage.getItem("token");

  return (
    <>
      <div className="header">
          <div className='logo-box'>
            <img className='logoIcon' src={LogoIcon} alt=''/>
            <span className='logo'>OilTracker</span>
            <Layout />
          </div>
          <ProfileBox />
      </div>
      
      <Routes>
        {user && 
          <>
            <Route path="/" exact element={<Home />} />
            <Route path="/transporter" element={<Transporter />} />
            <Route path="/regeneration" element={<Regeneration />} />
            <Route path="/admin" element={<Admin />} />
          </>
        }
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/login" exact element={<LogIn />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/transporter" element={<Navigate replace to="/login" />} />
        <Route path="/regeneration" element={<Navigate replace to="/login" />} />
        <Route path="/admin" element={<Navigate replace to="/login" />} />
      </Routes>
        <div>

        </div>

        <footer>
          <p>{t("footer")}</p>
        </footer>
    </>
  );
}
export default App;
