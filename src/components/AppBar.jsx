import React from 'react';
import { Box, Toolbar, IconButton, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import bic_logo from '../assetes/bic_logo.png';
import order_logo from '../assetes/logo_order1_flow.png'; 

const drawerWidth = 240;

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const MyAppBar = ({ open, handleDrawerOpen }) => {
  return (
    <StyledAppBar position="fixed" open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{p: 0, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={order_logo}
            alt="TLR Logo"
            style={{
              height: '65px',  
              maxWidth: '200px', 
              objectFit: 'contain'
            }}
          />
        </Box>
        <Box>
          <Tooltip title="אתר ביכורים">
            <IconButton
              component="a"
              href="https://www.bikurim.co.il"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ p: 0, boxShadow: 'none' }}
            >
              <Avatar alt="Bicurim" src={bic_logo} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};