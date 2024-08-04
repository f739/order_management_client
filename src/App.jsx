import React, { useState } from 'react';
import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bic_logo from './assetes/bic_logo.png';
import { useTestTokenQuery } from "./dl/api/usersApi";
import './css/main.css';
import { MyAppBar, BottomNav, DrawerMiniRight, LoudingPage } from "./components/indexComponents";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useJwtParser } from './hooks/useJwtParser';

export function Layout () {
  // const  { data: user, isLoading } = useTestTokenQuery();
  // useJwtParser();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // if (isLoading) return <LoudingPage /> ;
  // else 
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MyAppBar open={open} handleDrawerOpen={handleDrawerOpen}/>
      <DrawerMiniRight open={open} handleDrawerClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1}}>
        <Toolbar /> 
        <Outlet />
      </Box>
      <ToastContainer />
      {/* <BottomNav /> */}
    </Box>
  );
}

function App() {

  return (
      <div>
        <RouterProvider router={routers} />
      </div>
  );
}

export default App
