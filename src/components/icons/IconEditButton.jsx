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
      
        <IconButton 
          onClick={e => action(e)} 
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
          sx={{
            position: 'absolute',
            left: '6%',
            top: '50%', 
            transform: 'translateY(-50%)'
          }}
        >
          <EditIcon fontSize='small' />
        </IconButton>
     
    </TooltipComponent>
  )
} 
