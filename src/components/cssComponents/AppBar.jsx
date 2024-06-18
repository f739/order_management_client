import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container,
    Avatar, Button, Tooltip, MenuItem
 } from '@mui/material';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

const pages = [
  { name: 'הזמנות', subPages: [
    { name: 'הזמנות חדשות', path: '/orders' },
    { name: 'הזמנות בתהליך', path: './orderManagement' },
    { name: 'קליטת הזמנות', path: './oldOrders' },
  ]},
  { name: 'ניהול מערכת', subPages: [
    { name: 'משתמשים', path: './createUsers' },
    { name: 'מוצרים', path: './products' },
    { name: 'קטגוריות', path: './categories' },
    { name: 'ספקים', path: './supplier' },
    { name: 'יחידות מידה', path: './measure' },
  ]},
  { name: 'הגדרות חברה', path: './emailSettings' }
];

const settings = ['פרופיל', 'Account', 'Dashboard', 'התנתק'];

export const MyAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElSubMenu, setAnchorElSubMenu] = React.useState(null);
  const [subPages, setSubPages] = React.useState([]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenSubMenu = (event, subPages) => {
    setAnchorElSubMenu(event.currentTarget);
    setSubPages(subPages);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setAnchorElSubMenu(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TLR 
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={page.subPages ? (event) => handleOpenSubMenu(event, page.subPages) : handleCloseNavMenu}>
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
              id="submenu-appbar"
              anchorEl={anchorElSubMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElSubMenu)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {subPages.map((subPage) => (
                <MenuItem key={subPage.name} onClick={handleCloseNavMenu}>
                  <NavLink to={subPage.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {subPage.name}
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Box key={page.name} sx={{ position: 'relative' }}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
                {page.subPages && (
                  <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', zIndex: 1, bgcolor: 'background.paper' }}>
                    {page.subPages.map((subPage) => (
                      <MenuItem key={subPage.name} onClick={handleCloseNavMenu}>
                        <NavLink to={subPage.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {subPage.name}
                        </NavLink>
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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
}

export default MyAppBar;
