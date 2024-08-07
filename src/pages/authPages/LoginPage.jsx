import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleFormHook } from '../../hooks/HandleFormHook';
import { useConnectUserMutation } from '../../dl/api/usersApi';
import { CustomField } from '../../components/CustomField';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

export const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', email: '' });
    const { from } = location.state || { from: { pathname: "/" } };
    
    const fields = [
        { label: 'אמייל', type: 'input', typeInput: 'email', name: 'email' },
        { label: 'סיסמה', type: 'input', typeInput: 'password', name: 'password' },
    ];
    const [connectUser, { error: errorConnect, isLouding }] = useConnectUserMutation();
    const connect = async () => {
        try {
            await connectUser(form).unwrap();
            navigate('../../orders')
        } catch (err) { console.log(err);
        }
    }
    console.log(errorConnect);
    
    return (
        <Box sx={{p: 2}}>
            {errorConnect && <Alert severity="error" sx={{ mb: 2 }}>{errorConnect?.message || errorConnect.data.message}</Alert>}
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
            <Button onClick={connect} color="primary" variant="contained" disabled={isLouding}>
                {isLouding ? <CircularProgress size={24} /> : 'היכנס'}
            </Button>
        </Box>
    );
};
