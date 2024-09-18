import React from "react";
import { Box, Typography, Alert } from '@mui/material';
import { useGetUserQuery, useEditingUserEmailDetailsMutation} from "../../../dl/api/userSettingsApi";
import { ButtonConfirm, ErrorPage, LoudingPage } from '../../../components/indexComponents';
import { GeneralUserInfo } from "./GeneralUserInfo";
import { EmailDetails } from "../EmailDetails";
import { useDispatch } from "react-redux";
// import { WhatsAppDetails } from "./WhatsAppDetails";
import { actions } from '../../../dl/slices/auth';

export const UserDetails = () => {
  const dispatch = useDispatch();
  const { data: user, error: errorGetuser, isLoading: isLoadinguser } = useGetUserQuery();
  const [updateEmailDetails, { 
    isLoading: isLoadingUpdateEmail,
    error: errorUpdateEmail,
    isSuccess }
  ] = useEditingUserEmailDetailsMutation();
  
  if (isLoadinguser) return <LoudingPage />;
  if (errorGetuser) return <ErrorPage error={errorGetuser} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: '30px' }}>
        הגדרות משתמש
      </Typography>
      <ButtonConfirm
        confirmLabel="התנתק"
        confirmAction={() => dispatch(actions.logOut())}
      />
      <GeneralUserInfo user={user} />
      <Typography variant="h5" sx={{ marginBottom: '30px' }}>
        הגדרות שליחת הודעות
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
