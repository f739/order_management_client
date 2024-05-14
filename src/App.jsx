import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import { testToken } from "./dl/slices/users"
import { ToastContainer } from 'react-toastify';
import { NoEntry } from "./pages/noEntry";
import 'react-toastify/dist/ReactToastify.css';
import './css/main.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import bic_logo from './assetes/bic_logo.png';

export function Layout () {
  const dispatch = useDispatch();
  const { license } = useSelector( state => state.users.user);
  const { isLoadingToken } = useSelector( state => state.users);
  
  useEffect( () => {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch( testToken(token))
      }
  },[]) 
  if (isLoadingToken) return <h1>🌀 Loading...</h1>;
  else if (license === '') return <NoEntry />;
  else return (
    <>
    {/* <div className="logo-container">
      <img src={bic_logo} alt="Logo" className="logo" />
    </div> */}
        <nav>
          <NavLink to='/orders'>הזמנות חדשות</NavLink>
          <NavLink to='./orderManagement'>הזמנות בתהליך</NavLink>
          <NavLink to='./oldOrders'>קליטת הזמנות</NavLink>
          <NavLink to='./issuingReports'>הנפקת דוחות</NavLink>
          <NavLink to='/privateArea'>אזור אישי</NavLink>
        </nav>
        <ToastContainer />
        <Outlet />
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
