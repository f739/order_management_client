import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const DialogSendInvitation = ({ setOpenDialog, title, children }) => {
  return (
    <Dialog
      open={true}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title">
        {title}
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          style={{ position: 'absolute', left: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
};


