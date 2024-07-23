import {  IconButton, Tooltip, ClickAwayListener } from '@mui/material';
import { Replay as ReplayIcon } from '@mui/icons-material';
import { useState } from 'react';

export const IconReturnButton = props => {
const {action, title} = props;
const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

    return (
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip 
          PopperProps={{
            disablePortal: true,
          }}
          title={title} open={open} onClose={handleTooltipClose}>
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
            color: '#64B5F6', 
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
            }
          }}>
          <ReplayIcon fontSize='mediume' />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
    )
} 
