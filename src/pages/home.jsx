import React from 'react';
import { Box } from '@mui/material';
import { CreateCompany } from './CreateCompany';
import order_logo from '../assetes/order_flow_banner.jpg'; 

export const Home = () => {
    return (
        <Box sx={{p: 0}}>
          <img
            src={order_logo}
            alt="TLR Logo"
            style={{
              // objectFit: 'contain',
              maxHeight: '200px',
              width: '100%'
            }}
          />
        <CreateCompany />
        </Box> 
      );
    }


