import { useState } from 'react';
import { TooltipComponent } from '../TooltipComponent';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const IconAddButton = props => {
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
            onClick={action} 
            onMouseEnter={handleTooltipOpen}
            onMouseLeave={handleTooltipClose}
            sx={{
            borderColor: '#a5d6a7',
                '&:hover': {
                    borderColor: '#388e3c',
                    backgroundColor: 'rgba(165, 214, 167, 0.1)',
                }
            }}
        >
            <AddIcon sx={{ color: '#a5d6a7' }} />
        </Button>
    </TooltipComponent>
  )
} 
