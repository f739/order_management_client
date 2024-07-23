import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Box, CircularProgress, Button, Typography, Table, TableContainer, Paper, 
  Stack
 } from '@mui/material';
import {Close as CloseIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from '@mui/icons-material';

export const DialogSendInvitation = props => {
  const {title, setOpenDialog, labelConfirm='אשר', sendOrder, isLoudingSendOrder, to=false, cart=[], showTable=false, setShowTable,
    tableHead, tableBody, fields, errorMessage, labelDelete, actionDelete, isLoadingDelete, moreActions=false, sxBox={} } = props;

  return (
    <Dialog
      open={true}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title">
        <Typography>{title ?? 'הזמנה חדשה'}</Typography>
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          style={{ position: 'absolute', left: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={sxBox}>
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
            ) : cart.length === 0 ? (
              <Typography color="error">לא נבחרו מוצרים!</Typography>
            ) : null
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
        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, m: 1 }}>
            <Button onClick={() => setOpenDialog(false)} color="secondary" variant="outlined">
            בטל 
            </Button>
            { labelDelete && 
              <Button onClick={actionDelete} color="error"  variant="outlined" >
                {isLoadingDelete ? <CircularProgress size={24} /> : labelDelete}
              </Button> 
            }
            <Button onClick={sendOrder} color="primary" variant="contained" disabled={isLoudingSendOrder}>
                {isLoudingSendOrder ? <CircularProgress size={24} /> : labelConfirm}
            </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};


