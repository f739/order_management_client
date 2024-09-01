import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Alert, CircularProgress } from '@mui/material';
import { CustomField } from '../../components/CustomField';
import { useResetPasswordMutation } from '../../dl/api/authApi';
import { Link as MuiLink } from '@mui/material';
import { SimpleAlert } from '../../components/SimpleAlert';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [resetPassword, {error: errorResetPassword, isLouding}] = useResetPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await resetPassword({email}).unwrap();
      navigate('../emailVerificationPage');
    } catch (error) { }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          שחזור סיסמה
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {errorResetPassword && <SimpleAlert message={errorResetPassword} />}
                <CustomField
                  name='email'
                  type="email"
                  label='אמייל'
                  variant='outlined'
                  value={email}
                  onChange={ e => setEmail(e.target.value)}
                  required
                />              
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLouding}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLouding ? <CircularProgress size={24} /> : 'שלח'}
          </Button>
          <MuiLink 
            component={RouterLink} 
            to="../login" 
            variant="body2" 
            sx={{ 
                display: 'block', 
                textAlign: 'center',
                mt: 2 
            }}
          >
            התחברות
          </MuiLink>
          <MuiLink 
            component={RouterLink} 
            to="../EmailVerificationPage" 
            variant="body2" 
            sx={{ 
                display: 'block', 
                textAlign: 'center',
                mt: 2 
            }}
          >
            החלפת סיסמה
          </MuiLink>
        </Box>
      </Paper>
    </Container>
  );
};
