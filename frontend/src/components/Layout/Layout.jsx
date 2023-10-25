import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import './Layout.css';

const Layout = () => {

  const { t } = useTranslation();
  return (
    <>
      <div className="navigation-container">
            <NavLink className={({ isActive }) => (isActive ? "link activeLink" : "link")} to="/" name="home">Home</NavLink>
         
            <NavLink className={({ isActive }) => (isActive ? "link activeLink" : "link")} to="/transporter" name="transporter">{t('transporter')}</NavLink>
          
            <NavLink className={({ isActive }) => (isActive ? "link activeLink" : "link")} to="/regeneration" name="regeneration">{t('regeneration')}</NavLink>
      </div>

      <Outlet />
    </>
  )
};

export default Layout;