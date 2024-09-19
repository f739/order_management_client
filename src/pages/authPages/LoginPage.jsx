import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { handleFormHook } from '../../hooks/HandleFormHook';
import { useConnectUserMutation } from '../../dl/api/authApi';
import { Box, Button, CircularProgress, Container, Typography, Paper } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { SimpleAlert, CustomField } from '../../components/indexComponents';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    const [form, setForm] = useState({ password: '', email: email || '' });
     
    const fields = [
        { label: 'אמייל', type: 'input', typeInput: 'email', name: 'email' },
        { label: 'סיסמה', type: 'input', typeInput: 'password', name: 'password' },
    ];
    const [connectUser, { error: errorConnect, isLouding }] = useConnectUserMutation();
    const connect = async () => {
        try {
            await connectUser(form).unwrap();
            navigate('../../orders')
        } catch (err) { console.log(err) }
    }
    
    return (        
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, mb: 5 }}>
                <Typography component="h1" variant="h5" align="center">
                    התחברות
                </Typography>
                <Box sx={{mt: 3}}>
                    {errorConnect && <SimpleAlert message={errorConnect} />}
                    {fields.map( field => (
                        <React.Fragment key={field.name}>
                            <CustomField 
                            name={field.name}
                            type={field.typeInput ?? null}
                            value={form[field.name]}
                            label={field.label}
                            onChange={e => handleFormHook(e.target, setForm)}
                            variant='outlined'
                            />
                        </React.Fragment>
                    ))}
                    <Button 
                        onClick={connect} 
                        color="primary" 
                        variant="contained" 
                        disabled={isLouding}
                        fullWidth
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLouding ? <CircularProgress size={24} /> : 'היכנס'}
                    </Button>
                    <MuiLink 
                        component={RouterLink} 
                        to="../resetPassword" 
                        variant="body2" 
                        sx={{ 
                            display: 'block', 
                            textAlign: 'center',
                            mt: 2 
                        }}
                    >
                        שחזור סיסמה
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
