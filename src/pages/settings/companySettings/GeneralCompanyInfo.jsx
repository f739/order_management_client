import React, { useState } from "react";
import { Box, Typography } from '@mui/material';
import { CustomField, ButtonConfirm, SimpleAlert } from "../../../components/indexComponents";
import { useEditCompanyDetailsMutation } from "../../../dl/api/companyApi";
import { handleFormHook } from "../../../hooks/HandleFormHook";

export const GeneralCompanyInfo = ({ company }) => {
  const [updateCompanyDetails, { isLoading: isLoadingEdit, error: errorEdit, isSuccess }] = useEditCompanyDetailsMutation();
  const [editCompanyDetails, setEditCompanyDetails] = useState({
    nameCompany: '',
    companyRegistration: '',
    address: '',
    email: '',
    phone: '',
    // logo: company.logoUrl
  });
  
  const handleSave = async companyUpdated => {
    try {
      await updateCompanyDetails(companyUpdated).unwrap();
    } catch (error) {
     console.log(error);
    }
  };
    const fields = [
        { name: 'nameCompany', label: "שם החברה", typeInput: 'text', type: 'input' },
        { name: 'companyRegistration', label: "ח.פ.", typeInput: 'number', type: 'input' },
        { name: 'address', label: 'כתובת', typeInput: 'text', type: 'input' },
        { name: 'email', label: 'אימייל', typeInput: 'email', type: 'input' },
        { name: 'phone', label: 'טלפון', typeInput: 'tel', type: 'input' },
    ];
  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5">פרטי חברה</Typography>
      <SimpleAlert message={'פרטים אלו נכתבים בדף ההזמנה לספק'} severity={'info'} />
      { fields.map( field => (
        <React.Fragment key={field.name}>
            <CustomField 
              name={field.name}
              initialValue={company[field.name]}
              value={editCompanyDetails[field.name]}
              label={field.label}
              onChange={e => handleFormHook(e.target, setEditCompanyDetails)}
            />
        </React.Fragment>
      ))}
      {/* <CustomField 
        name="logo"
        value={editCompanyDetails.logo}
        label="לוגו חברה"
        type="file"
        onChange={e => handleFormHook(e.target, setEditCompanyDetails)}
      /> */}
        {errorEdit && <SimpleAlert message={errorEdit} />}
        {isSuccess && <SimpleAlert message={'העידכון הושלם בהצלחה'} severity={'success'} />}
      <ButtonConfirm 
        confirmLabel="שמור שינויים"
        confirmAction={() => handleSave(editCompanyDetails)}
        isLoading={isLoadingEdit}
      />
    </Box>
  );
};