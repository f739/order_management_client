import React from 'react';
import { Paper, IconButton, useMediaQuery, Box, Popper, Modal, ClickAwayListener, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

export const FilterDrawer = props => {
  const { openFilters, setOpenFilters, anchorRef, children } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const toggleDrawer = () => {
    setOpenFilters(old => !old);
  };

  const handleClickAway = () => {
    if (isSmallScreen) {
      setOpenFilters(false);
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250, minHeight: '500px', padding: 2, overflow: 'auto' }}>
      <IconButton onClick={toggleDrawer} >
        <CloseIcon />
      </IconButton>
      <Typography>סינון</Typography>
        <>
          {children}
        </>
    </Box>
  );

  if (isSmallScreen) {
    return (
      <Popper
        keepMounted
        open={openFilters}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, top: '0 !important', right: '0 !important' }}
      >
        {/* <ClickAwayListener onClickAway={handleClickAway}> */}
          <Paper >{drawerContent}</Paper>
        {/* </ClickAwayListener> */}
      </Popper>
    )
  }

  return (
    <Box 
      sx={{ 
        width: openFilters ? 250 : 0, 
        flexShrink: 0,
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden',
        height: '100%',
        boxShadow: openFilters ? 3 : 0,
        marginLeft: '10px'
      }}
    >
      <Paper>{drawerContent}</Paper>
    </Box>
  );
};