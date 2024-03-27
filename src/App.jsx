import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import { testToken } from "./dl/slices/users"
import { ToastContainer } from 'react-toastify';
import { NoEntry } from "./pages/noEntry";
import 'react-toastify/dist/ReactToastify.css';
import './css/main.css';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import bic_logo from './assetes/bic_logo.png';

export function Layout () {
  const dispatch = useDispatch();
  const [license, setLicense] = useState('');

  useEffect( () => {
    const testTokenFunc = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res =  await dispatch( testToken(token))
        setLicense(res.payload);
      }
    }; testTokenFunc()
  },[]) 
  return (
    <>
    <div className="logo-container">
      <img src={bic_logo} alt="Logo" className="logo" />
    </div>
      {license && 
      <>
        <nav>
          <NavLink to='/orders'>הזמנות חדשות</NavLink> ||
          <NavLink to='./orderManagement'>הזמנות בתהליך</NavLink> ||
          <NavLink to='./oldOrders'>קליטת הזמנות</NavLink> ||
          <NavLink to='./issuingReports'>הנפקת דוחות</NavLink> ||
          <NavLink to='/privateArea'>אזור אישי</NavLink> ||
        </nav>
        <ToastContainer />
        <Outlet />
      </>
      }
      {!license && <NoEntry />}
    </>

  )
}

function App() {

  return (
      <div>
        <RouterProvider router={routers} />
      </div>
  );
}

export default App
