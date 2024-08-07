import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Alert, CircularProgress } from '@mui/material';
import { CustomField } from '../../components/CustomField';
import { handleFormHook } from '../../hooks/HandleFormHook';
import { useVerifyEmailAndUpdatePassMutation } from '../../dl/api/companyApi';

export const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const [formEmailVerification, setFormEmailVerification] = useState({tempPassword: '',newPassword: '', confirmPassword: ''});
    const [verifyEmail, {error: errorVerify, isLouding}] = useVerifyEmailAndUpdatePassMutation();
    const fields = [
        {name: 'tempPassword',  label: "סיסמה ישנה / זמנית"},
        {name: 'newPassword',  label: "סיסמה חדשה"},
        {name: 'confirmPassword',  label: "אימות סיסמה"},
    ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await verifyEmail(formEmailVerification).unwrap();
      navigate('../../orders');
    } catch (error) { }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          אימות אימייל ושינוי סיסמה
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {errorVerify && <Alert severity="error" sx={{ mb: 2 }}>{errorVerify?.message || errorVerify.data.message}</Alert>}
          { fields.map( field => (
            <React.Fragment key={field.name}>
                <CustomField
                  name={field.name}
                  type="password"
                  label={field.label}
                  variant='outlined'
                  value={formEmailVerification[field.name] || ''}
                  onChange={(e) => handleFormHook(e.target, setFormEmailVerification)}
                  required
                />              
            </React.Fragment>
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLouding}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLouding ? <CircularProgress size={24} /> : 'שלח'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
