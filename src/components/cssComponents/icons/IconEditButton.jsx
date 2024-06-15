import { useState } from 'react';
import {  IconButton } from '@mui/material';
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
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
          padding: '8px',
          color: '#64b5f6', 
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
          }
        }} 
        >
        <EditIcon fontSize='mediume'  />
      </IconButton>
    </TooltipComponent>
  )
} 
