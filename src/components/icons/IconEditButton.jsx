import { useState } from 'react';
import {  IconButton, Box } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { TooltipComponent } from '../TooltipComponent';

export const IconEditButton = props => {
const {action, title} = props;
const [open, setOpen] = useState(false);
  
const handleTooltipClose = () => {
  setOpen(false);
};

const handleTooltipOpen = () => {
  setOpen(true);
};

  return (
    <TooltipComponent title={title} open={open} handleTooltipClose={handleTooltipClose}>
      <Box 
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        height="100%"
        width="100%"
      >
        <IconButton 
          onClick={e => action(e)} 
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
        >
          <EditIcon fontSize='small' />
        </IconButton>
      </Box>
    </TooltipComponent>
  )
} 
