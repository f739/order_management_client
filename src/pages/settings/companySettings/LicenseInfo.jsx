import React from "react";
import { Box, Divider, Typography } from '@mui/material';
import { ButtonConfirm, TimedAlert } from '../../../components/indexComponents'
import { useBuyLicenseMutation } from '../../../dl/api/companyApi';
import moment from 'moment';

export const LicenseInfo = ({company}) => {
  
  const [buyLicense,
    { 
      data,
      isLoading: isLoadingBuyLicense,
      error: errorBuyLicense
    }
  ] = useBuyLicenseMutation();
  
  const handleBuy = async timeUnit => {
    try {
      await buyLicense(timeUnit).unwrap();
    }catch (err) { console.log(err)  }
  }

  return (
    <Box sx={{ p: 1 }}>
      <Divider sx={{ marginTop: '40px' }}>
        <Typography variant="h6" >
          רישיון חברה
        </Typography>
      </Divider>
      <Typography variant="h6">תאריך יצירת חברה: {moment.unix(company.companyCreationDate).format("DD.MM.YYYY")}</Typography>
      <Typography variant="h6">תאריך תפוגה: {moment.unix(company.expirationDate).format("DD.MM.YYYY")} </Typography>
      <ButtonConfirm
        confirmLabel="רישיון חודשי"
        confirmAction={() => handleBuy('M')}
        isLoading={isLoadingBuyLicense}
      />
      <ButtonConfirm
        confirmLabel="רישיון שנתי"
        confirmAction={() => handleBuy('Y')}
        isLoading={isLoadingBuyLicense}
      />
      {errorBuyLicense && <TimedAlert message={errorBuyLicense}  />}
      {data && <TimedAlert message={data} severity='success' />}
    </Box>
  );
};