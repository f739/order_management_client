import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import logo from '../assetes/logo_order1_flow.png';
import CopyrightIcon from '@mui/icons-material/Copyright';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        borderTop: 200,
        py: 3,
        bottom: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={4} sm={3} md={3}>
            <Typography variant="h6" gutterBottom sx={{pt: 0}}>
              ניווט מהיר
            </Typography>
            <Link href="/" color="inherit" display="block">בית</Link>
            <Link href="/orders" color="inherit" display="block">הזמנות</Link>
            <Link href="/contentManagement/products" color="inherit" display="block">ניהול תוכן</Link>
            <Link href="/contactForm" color="inherit" display="block">צור קשר</Link>
          </Grid>
          <Grid item xs sm={4} md={3}>
            <Typography variant="h6" sx={{pt: 0}} gutterBottom>
              צור קשר
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton href="mailto:shimkifux@gmail.com" color="inherit" size="small">
                <EmailIcon />
              </IconButton>
              <Typography variant="body2">shimkifux@gmail.com</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton href="tel:0504137048" color="inherit" size="small">
                <PhoneIcon />
              </IconButton>
              <Typography variant="body2">0504137048</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton color="inherit" size="small">
                <CopyrightIcon />
              </IconButton>
              <Typography variant="body2" align="center">
                כל הזכויות שמורות
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <img src={logo} alt="Order Flow" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};