import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import bic_logo from './assetes/bic_logo.png';
import { useTestTokenQuery } from "./dl/api/usersApi";
import './css/main.css';
import { MyAppBar, BottomNav } from "./components/indexComponents";

export function Layout () {
  const  { data: user, isLoading } = useTestTokenQuery();
  if (isLoading) return <h1>🌀 Loading...</h1>;
  else return (
    <>
      <MyAppBar />
      <ToastContainer />
      <Outlet /> 
      {/* <BottomNav /> */}
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
