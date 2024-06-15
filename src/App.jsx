import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import { ToastContainer } from 'react-toastify';
import { NoEntry } from "./pages/noEntry";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import bic_logo from './assetes/bic_logo.png';
import { useTestTokenQuery } from "./dl/api/usersApi";
import './css/main.css';

export function Layout () {
  const  { data: user, isLoading } = useTestTokenQuery();
  const [ifLicense, setIfLicense] = useState(user);
  if (isLoading) return <h1>🌀 Loading...</h1>;
  // else if (!ifLicense && !user) return <NoEntry setIfLicense={setIfLicense} />;
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
