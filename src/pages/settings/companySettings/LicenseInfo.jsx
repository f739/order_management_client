import React from "react";
import { Box, Typography } from '@mui/material';
import { ButtonConfirm, TimedAlert } from '../../../components/indexComponents'
import { useBuyLicenseMutation } from '../../../dl/api/companyApi';
export const LicenseInfo = () => {
  const [buyLicense,
    { 
      data,
      isLoading: isLoadingBuyLicense,
      error: errorBuyLicense
    }
  ] = useBuyLicenseMutation();
  
  const handleSave = async () => {
    try {
      await buyLicense({}).unwrap();
    }catch (err) { console.log(err)  }
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5">רישיון חברה</Typography>
      <Typography variant="h6">תחילת שימוש: 16.03.2023</Typography>
      <Typography variant="h6">תאריך תפוגה: 28.03.2023</Typography>
      <ButtonConfirm
        confirmLabel="הארך תקופת ניסיון"
        confirmAction={() => handleSave()}
        isLoading={isLoadingBuyLicense}
      />
      {errorBuyLicense && <TimedAlert message={errorBuyLicense}  />}
      {data && <TimedAlert message={data} severity='success' />}
    </Box>
  );
};