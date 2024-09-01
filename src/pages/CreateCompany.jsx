import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, Checkbox, FormControlLabel, Typography,  } from '@mui/material';
import { CustomField } from '../components/indexComponents';
import { handleFormHook } from '../hooks/HandleFormHook';
import { useCreateNewCompanyMutation } from '../dl/api/companyApi';
import { SimpleAlert } from '../components/indexComponents';

export const CreateCompany = () => {
    const navigate = useNavigate();
    const [newCompany, setNewCompany] = useState({nameCompany: '', companyRegistration: '', address: '', email: '', phone: '', userName: '', approvalOfRegulations: false});;

    const fields = [
        {name: 'nameCompany', label: "שם החברה", type: 'input' },
        {name: 'userName', label: "שם המנהל", type: 'input' },
        {name: 'companyRegistration', label:"ח.פ.", type: 'input', typeInput: 'number' },
        {name: 'address', label: "כתובת", type: 'input' },
        {name: 'email', label: "דואר אלקטרוני", type: 'input', typeInput: 'email' },
        {name: 'phone', label: "פלאפון", type: 'input', typeInput: 'tel' },
    ];

    const [createCompany, {isLouding: isLoudingCreateCompany, error: errorCreateCompany}] = useCreateNewCompanyMutation()

    const handleCreateCompany = async () => {
        try {
            await createCompany(newCompany).unwrap();
            navigate('./auth/emailVerificationPage');
        }catch (err) {}
    }

    const handleApprovalOfRegulations = checked => {
        setNewCompany( old => { return {
            ...old,
            approvalOfRegulations: checked
        }})
    } 

    return (
        <>
            <Box sx={{p: 5, minHeight: '600px', width: '400px', boxShadow: 1, borderRadius: 5, m: 2}}>
                <Stack sx={{ p: 1 }}
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={1}>
                    {
                        fields.map( field => (
                            <React.Fragment key={field.name}>
                                <CustomField 
                                    name={field.name}
                                    type={field.typeInput ?? null}
                                    value={newCompany[field.name]}
                                    label={field.label}
                                    onChange={e => handleFormHook(e.target, setNewCompany)}
                                />
                            </React.Fragment>
                        ))
                    }
                    <FormControlLabel 
                        control={<Checkbox 
                            size="small" 
                            color="secondary" 
                            checked={newCompany.approvalOfRegulations}
                            onChange={e => handleApprovalOfRegulations(e.target.checked)} 
                        />} 
                        label="אשר תקנון"
                    />
                    {errorCreateCompany && <SimpleAlert message={errorCreateCompany} />}
                    <Button onClick={handleCreateCompany} color="primary" variant="contained" disabled={isLoudingCreateCompany}>
                        {isLoudingCreateCompany ? <CircularProgress size={24} /> : 'צור חברה'}
                    </Button>
                </Stack>
            </Box>
        </>
    )
}