import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import { TooltipComponent } from '../TooltipComponent';

export const IconDeleteButton = props => {
  const { action, title } = props;
  const [open, setOpen] = useState(false);
  
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <TooltipComponent 
    title={title} 
    open={open} 
    handleTooltipClose={handleTooltipClose} >
        <IconButton
          onClick={e => {
            action(e);
            handleTooltipOpen();
          }}
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '8px',
            color: '#e57373',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            }
          }}>
          <DeleteIcon fontSize='mediume' />
        </IconButton>
    </TooltipComponent>
  )
} 
