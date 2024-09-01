import React from "react";
import { Box, Typography, Alert } from '@mui/material';
import { useGetUserQuery, useEditingUserEmailDetailsMutation} from "../../../dl/api/userSettingsApi";
import { ErrorPage, LoudingPage } from '../../../components/indexComponents';
import { GeneralUserInfo } from "./GeneralUserInfo";
import { EmailDetails } from "../EmailDetails";
// import { WhatsAppDetails } from "./WhatsAppDetails";

export const UserDetails = () => {
  const { data: user, error: errorGetuser, isLoading: isLoadinguser } = useGetUserQuery();
  const [updateEmailDetails, { 
    isLoading: isLoadingUpdateEmail,
    error: errorUpdateEmail,
    isSuccess }
  ] = useEditingUserEmailDetailsMutation();

  if (isLoadinguser) return <LoudingPage />;
  if (errorGetuser) return <ErrorPage error={errorGetuser} />;

  return (
    <Box sx={{ p: 5 }}>
      <Alert variant="standard" severity="warning">לא ניתן לשלוח אימיילים כל עוד שלא אומתו</Alert>
      <Typography variant="h4" sx={{ marginBottom: '40px' }}>
        הגדרות משתמש
      </Typography>

      <GeneralUserInfo user={user} />
      <Typography variant="h4" sx={{ marginBottom: '40px' }}>
        הגדרות שליחת אימיילים
      </Typography>
      <EmailDetails 
        isUser={true}
        emailDetails={user.sendingMessages.email} 
        onUpdateEmail={updateEmailDetails} 
        isLoadingUpdateEmail={isLoadingUpdateEmail}
        isSuccess={isSuccess}
        errorUpdateEmail={errorUpdateEmail}
      />
      {/* <WhatsAppDetails whatsAppDetails={company.sendingMessages.watsapp} /> */}
    </Box>
  );
};
