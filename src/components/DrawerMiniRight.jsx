import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.down('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
export const DrawerMiniRight = ({ open, handleDrawerClose }) => {
    const theme = useTheme();
    const location = useLocation();
    const [subPages, setSubPages] = useState([]);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const pages = [
      { name: 'כניסה', icon: <VpnKeyIcon /> , path: '/auth/login' },
      { name: 'הזמנות', icon: <ShoppingCartIcon />, path: '/orders' },
      { name: 'ניהול תוכן', icon: <BusinessIcon />, path: '/contentManagement/products' },
      { name: 'הגדרות חברה', icon: <SettingsIcon /> , path: '/companySettings/companyDetails' },
    ];

    const contentManagementPages = [
      {name: 'מוצרים', icon: <Inventory2Icon />, path: '/contentManagement/products'},
      {name: 'ספקים', icon: <LocalShippingIcon />, path: '/contentManagement/supplier'},
      {name: 'קטגוריות', icon: <CategoryIcon />, path: '/contentManagement/categories'},
      {name: 'יחידות מידה', icon: <SquareFootIcon />, path: '/contentManagement/measure'},
      {name: 'משתמשים', icon: <PeopleIcon />, path: '/contentManagement/Users'},
      {name: 'סניפים', icon: <StoreIcon />, path: '/contentManagement/branches'},
    ];

    const orderPages = [
      {name: 'הזמנות', icon: <ReceiptIcon />, path: '/orders'},
      {name: 'ניהול הזמנות', icon: <ShoppingCartIcon />, path: '/orderManagement'},
      {name: 'היסטוריית הזמנות', icon: <MoveToInboxIcon />, path: '/oldOrders'},
    ];

    const companySettingsPages = [
      {name: 'פרטי חברה', icon: <BusinessCenterIcon />, path: '/companySettings/companyDetails'},
      {name: 'פרטי משתמש', icon: <ManageAccountsIcon />, path: '/companySettings/UserDetails'},
    ];

    useEffect(() => {
      if (location.pathname.startsWith('/contentManagement')) {
        setSubPages(contentManagementPages);
      } else if (location.pathname.startsWith('/orders') || location.pathname.startsWith('/orderManagement') || location.pathname.startsWith('/oldOrders')) {
        setSubPages(orderPages);
      } else if (location.pathname.startsWith('/companySettings')) {
        setSubPages(companySettingsPages);
      } else {
        setSubPages([]);
      }
    }, [location]);

    const isActive = (path) => {
      if (path === '/orders') {
        return location.pathname.startsWith('/orders') || 
               location.pathname.startsWith('/orderManagement') || 
               location.pathname.startsWith('/oldOrders');
      }
      return location.pathname.startsWith(path);
    };

    return (
      <Drawer
        variant="permanent"
        open={open}
        anchor="right"
        sx={{
          '& .MuiDrawer-paper': { 
            borderRight: 'none',
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            height: '100%',
            [theme.breakpoints.down('sm')]: {
              width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
            },
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon /> 
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ flexGrow: 1}}>
          {pages.map((page) => (
            <ListItem key={page.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={page.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 1 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(page.icon, { 
                    color: isActive(page.path) ? 'primary' : 'action'
                  })}
                </ListItemIcon>
                <ListItemText 
                  primary={page.name} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    display: isMobile && !open ? 'none' : 'block',
                    color: isActive(page.path) ? theme.palette.primary.main : 'inherit',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {subPages.length > 0 && (
          <>
            <Divider />
            <List>
              {subPages.map((page) => (
                <ListItem key={page.name} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={page.path}
                    sx={{
                      minHeight: 18,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(page.icon, { 
                        color: location.pathname === page.path ? 'primary' : 'action'
                      })}
                    </ListItemIcon>
                    <ListItemText 
                      primary={page.name} 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        display: isMobile && !open ? 'none' : 'block',
                        color: location.pathname === page.path ? theme.palette.primary.main : 'inherit',
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Drawer>
    );
};