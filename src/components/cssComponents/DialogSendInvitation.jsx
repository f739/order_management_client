import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Box, CircularProgress, Button, Typography, Table, TableContainer, Paper 
 } from '@mui/material';
import {Close as CloseIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from '@mui/icons-material';

export const DialogSendInvitation = props => {
  const { setOpenDialog, sendOrder, isLoudingSendOrder, to, cart, showTable=false, setShowTable,
    tableHead, tableBody, fields, errorMessage, actions=false, moreActions=false } = props;

  return (
    <Dialog
      open={true}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title">
        <Typography>הזמנה חדשה</Typography>
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          style={{ position: 'absolute', left: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        { to && 
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">אל</Typography>
            <Typography>{to}</Typography>
          </Box> 
        }
        { cart.length > 0  ? (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">מוצרים בהזמנה</Typography>
                <IconButton onClick={() => setShowTable(val => !val)}>
                  {showTable ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            </Box>
            ) : (
              <Typography color="error">לא נבחרו מוצרים!</Typography>
            )
        }
        { showTable && tableHead && tableBody && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table aria-label="cart items table">
                {tableHead}
                {tableBody}
              </Table>
          </TableContainer>
        )}
        {fields}
        {moreActions && moreActions}
      </DialogContent>
      {errorMessage && 
        <Box sx={{ mt: 2, p: 1, border: '1px solid',
          borderColor: 'error.main', borderRadius: 1, bgcolor: 'error.light' }}>
          <Typography>
            {errorMessage.message}
          </Typography>
        </Box>
      }
      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'end' ,width: '100%' }}>
            {actions && actions}
            <Button onClick={() => setOpenDialog(false)} color="secondary" variant="outlined">
            בטל 
            </Button>
            <Button onClick={sendOrder} color="primary" variant="contained" disabled={isLoudingSendOrder}>
                {isLoudingSendOrder ? <CircularProgress size={24} /> : 'שלח'}
            </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};


