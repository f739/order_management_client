import React, { useState } from 'react';
import { Outlet, RouterProvider } from "react-router-dom";
import { routers } from "./routers";
import { MyAppBar, Footer, DrawerMiniRight } from "./components/indexComponents";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import './css/main.css';

export function Layout () {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MyAppBar open={open} handleDrawerOpen={handleDrawerOpen}/>
      <DrawerMiniRight open={open} handleDrawerClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1}}>
        <Toolbar /> 
        <Outlet />
        <Footer />
      </Box>
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
