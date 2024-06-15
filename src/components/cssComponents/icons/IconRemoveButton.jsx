import { useState } from 'react';
import { TooltipComponent } from '../TooltipComponent';
import { Button } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

export const IconRemoveButton = props => {
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
        <Button 
            variant="outlined" 
            onMouseEnter={handleTooltipOpen}
            onMouseLeave={handleTooltipClose}
            onClick={ e => action(e)} 
            sx={{
                borderColor: '#ef9a9a',
                '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(239, 154, 154, 0.1)',
                }
            }}
            >
            <RemoveIcon sx={{ color: '#ef9a9a' }} />
        </Button>
    </TooltipComponent>
  )
} 
