import React, { useState, useRef } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

const pages = [
  {
    name: 'הזמנות',
    subPages: [
      { name: 'הזמנות חדשות', path: '/orders' },
      { name: 'הזמנות בתהליך', path: './orderManagement' },
      { name: 'קליטת הזמנות', path: './oldOrders' },
    ],
  },
  {
    name: 'ניהול מערכת',
    subPages: [
      { name: 'משתמשים', path: './systemManagement/users' },
      { name: 'מוצרים', path: './systemManagement/products' },
      { name: 'קטגוריות', path: './systemManagement/categories' },
      { name: 'ספקים', path: './systemManagement/supplier' },
      { name: 'יחידות מידה', path: './systemManagement/measure' },
    ],
  },
  { name: 'הגדרות חברה', path: './emailSettings' },
];

const settings = ['פרופיל', 'Account', 'Dashboard', 'התנתק'];

export const MyAppBar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSubMenu, setAnchorElSubMenu] = useState(null);
  const [subPages, setSubPages] = useState([]);
  const timeoutRef = useRef(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenSubMenu = (event, subPages) => {
    clearTimeout(timeoutRef.current);
    setAnchorElSubMenu(event.currentTarget);
    setSubPages(subPages);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setAnchorElNav(null);
      setAnchorElSubMenu(null);
    }, 200);
  };

  const handleCloseSubMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setAnchorElSubMenu(null);
    }, 200);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    setAnchorElNav(null);
    setAnchorElSubMenu(null);
  };

  return (
    <AppBar position="static" sx={{marginBottom: '20px'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ boxShadow: 'none' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              MenuListProps={{
                onMouseLeave: handleCloseNavMenu,
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onMouseEnter={page.subPages ? (event) => handleOpenSubMenu(event, page.subPages) : handleCloseSubMenu}
                  onClick={page.subPages ? (event) => handleOpenSubMenu(event, page.subPages) : handleCloseNavMenu}
                >
                  <Typography textAlign="center">
                    {page.subPages ? (
                      <span>{page.name}</span>
                    ) : (
                      <NavLink to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {page.name}
                      </NavLink>
                    )}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
            <Menu
              anchorEl={anchorElSubMenu}
              open={Boolean(anchorElSubMenu)}
              onClose={handleCloseSubMenu}
              onMouseEnter={() => clearTimeout(timeoutRef.current)}
              onMouseLeave={handleCloseSubMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {subPages.map((subPage) => (
                <MenuItem key={subPage.name} onClick={() => handleNavigate(subPage.path)}>
                  <Typography variant="inherit">{subPage.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: 'flex',
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TLR
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="הגדרות משתמש">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, boxShadow: 'none' }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MyAppBar;
