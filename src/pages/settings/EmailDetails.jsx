import React, { useState } from "react";
import { Box, Typography, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { CustomField, ButtonConfirm } from "../../components/indexComponents";
import { handleFormHook } from "../../hooks/HandleFormHook";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { SimpleAlert } from "../../components/SimpleAlert";

export const EmailDetails = props => {
  const { isUser, emailDetails, onUpdateEmail, isLoadingUpdateEmail, isSuccess, errorUpdateEmail } = props;
  const initialStateEmail = {
    service: emailDetails.service,
    ifVerified: emailDetails.ifVerified,
    ifUse: emailDetails.ifUse || true,
    email: '',
    password: ''
  }
  const [email, setEmail] = useState(initialStateEmail);

  const handleVerify = async emailUpdated => {
    try {
      console.log(emailUpdated);
      
      await onUpdateEmail(emailUpdated).unwrap();
      setEmail(initialStateEmail);
    } catch (error) { }
  };

  const handleEmailPicker = ({target}) => {
    const { checked } = target;
    setEmail( old => {return { 
      ...old, ifUse: checked
    }});
  }
  const labelChooseEmail = 'שלח הודעות מהאימייל הפרטי';

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5">פרטי אימייל</Typography>
      {errorUpdateEmail && <SimpleAlert message={errorUpdateEmail} />}
      <CustomField
        name="service"
        initialValue={emailDetails.service}
        value={email.service}
        label="ספק אימייל"
        type="text"
        disabled
        onChange={e => handleFormHook(e.target, setEmail)}
      />
      <CustomField
        name="email"
        initialValue={emailDetails.email}
        value={email.email}
        label="דואר אלקטרוני"
        type="email"
        onChange={e => handleFormHook(e.target, setEmail)}
        icon={email.ifVerified ? <TaskAltIcon /> : <ErrorOutlineIcon />}
      />
      <CustomField
        name="password"
        value={email.password}
        label="סיסמה בת 16 ספרות לגימייל"
        type="password"
        onChange={e => handleFormHook(e.target, setEmail)}
      />
      { isUser && <FormControlLabel 
        control={
          <Checkbox 
            checked={email.ifUse} 
            onChange={handleEmailPicker} 
          />
        } 
        label={labelChooseEmail} 
        sx={{display: 'block'}}
      />}
      {isSuccess && <SimpleAlert severity='success' message="הודעת ניסיון נשלחה למייל" />}
      <ButtonConfirm
        confirmLabel="אימות אימייל"
        confirmAction={() => handleVerify(email)}
        isLoading={isLoadingUpdateEmail}
      />
    </Box>
  );
};
