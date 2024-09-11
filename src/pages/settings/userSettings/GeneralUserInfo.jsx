import React, { useState } from "react";
import { Box, Typography } from '@mui/material';
import { CustomField, ButtonConfirm } from "../../../components/indexComponents";
import { useEditUserDetailsMutation } from "../../../dl/api/userSettingsApi";
import { handleFormHook } from "../../../hooks/HandleFormHook";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { SimpleAlert } from "../../../components/SimpleAlert";

export const GeneralUserInfo = ({ user }) => {
  const [updateUserDetails, { isLoading: isLoadingEdit, error: errorEdit }] = useEditUserDetailsMutation();
  const [editUserDetails, setEditUserDetails] = useState({
    _id: user._id,
    role: user.role,
    userName: '',
    email: '',
  });

  const handleSave = async UserUpdated => {
    try {
      await updateUserDetails(UserUpdated).unwrap();  
    } catch (error) {
     console.log(error);
    }
  };
    const fields = [
        { name: 'userName', label: "שם משתמש", typeInput: 'text', type: 'input' },
        { name: 'email', label: "אימייל", typeInput: 'email', type: 'input', icon: <TaskAltIcon /> },
        { name: 'role', label: 'תפקיד', typeInput: 'text', type: 'input', disabled: true },
        { name: 'branch', label: 'סניף', typeInput: 'text', type: 'input', disabled: true },

    ];
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5">פרטי משתמש</Typography>
      { fields.map( field => (
        <React.Fragment key={field.name}>
            <CustomField 
              name={field.name}
              initialValue={user[field.name]}
              value={editUserDetails[field.name]}
              label={field.label}
              disabled={field.disabled ?? false}
              onChange={e => handleFormHook(e.target, setEditUserDetails)}
            />
        </React.Fragment>
      ))}
      {errorEdit && <SimpleAlert message={errorEdit} />}
      <ButtonConfirm 
        confirmLabel="שמור שינויים"
        confirmAction={() => handleSave(editUserDetails)}
        isLoading={isLoadingEdit}
      />
    </Box>
  );
};