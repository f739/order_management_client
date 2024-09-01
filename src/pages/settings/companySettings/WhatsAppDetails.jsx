
import React, { useState } from "react";
import { Box, Typography, Switch } from '@mui/material';
import { CustomField, ButtonConfirm } from "../../../components/indexComponents";
import { useEditingCompanyWhatsappDetailsMutation } from "../../../dl/api/companyApi";
import { handleFormHook } from "../../../hooks/HandleFormHook";

export const WhatsAppDetails = ({ whatsAppDetails }) => {
  const [updateWhatsappDetails, { isLoading: isLoadingVerifyPhone }] = useEditingCompanyWhatsappDetailsMutation();
  const [whatsapp, setWhatsapp] = useState({
    phone: '',
    password: '',
    ifVerified: whatsAppDetails.ifVerified
  });

  const handleVerify = async whatsappUpdated => {
    try {
      await updateWhatsappDetails(whatsappUpdated).unwrap();
      // הודעת הצלחה
    } catch (error) {
      // טיפול בשגיאה
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5">פרטי ווצאפ</Typography>
      <CustomField 
        name="phone"
        initialValue={whatsAppDetails.phone}
        value={whatsapp.phone}
        label="מספר טלפון"
        type="tel"
        onChange={e => handleFormHook(e.target, setWhatsapp)}
      />
      <CustomField 
        name="password"
        value={whatsapp.password}
        label="סיסמה לווצאפ"
        type="password"
        onChange={e => handleFormHook(e.target, setWhatsapp)}
      />
      <ButtonConfirm 
        confirmLabel="אימות מספר טלפון"
        confirmAction={() => handleVerify(whatsapp)}
        isLoading={isLoadingVerifyPhone}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography>סטטוס אימות:</Typography>
        <Switch checked={whatsapp.ifVerified} disabled />
      </Box>
    </Box>
  );
};