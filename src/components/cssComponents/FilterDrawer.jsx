import React, { useState } from 'react';
import { Drawer, Button, IconButton, List, ListItem, ListItemText, useMediaQuery, useTheme, Box, CssBaseline, Chip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const FilterDrawer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250, padding: 2 }}>
      <IconButton onClick={toggleDrawer(false)}>
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem button>
          <ListItemText primary="לפי מוצר" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="לפי קטגוריה" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="לפי יחידת מידה" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="לפי מפעל" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
    <Box >
      <IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="open drawer">
        <FilterListIcon />
      </IconButton>
      <Chip label='יבשים' />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          display: 'block',
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>

    </>
  );
};

export default FilterDrawer;
