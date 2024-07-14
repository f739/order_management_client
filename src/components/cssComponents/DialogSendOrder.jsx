// import React, { useState } from 'react';
// import {Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl,
//   InputLabel, Select, MenuItem, FormHelperText, TextField, Typography} from '@mui/material';

// export const DialogSendOrder = props => {
//     const { setOpenDialog, SendAnInvitation, user } = props;
//   const [factorySelect, setFactorySelect] = useState(user.factory);
//   const [note, setNote] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSendInvitation = () => {
//     if (factorySelect !== '') {
//         SendAnInvitation(factorySelect, note)
//         setOpenDialog(false)
//     }else {
//         setErrorMessage('בחר סניף לשליחה');
//     }
//   };

//   return (
//     <>
//       <Dialog
//         open={true}
//         onClose={ () => setOpenDialog(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">שלח הזמנה</DialogTitle>
//         <DialogContent>
//           { user.license === 'purchasingManager' &&
//            <FormControl sx={{ m: 1, minWidth: 120 }}>
//             <InputLabel id="demo-simple-select-helper-label">סניף</InputLabel>
//             <Select
//               labelId="demo-simple-select-helper-label"
//               id="demo-simple-select-helper"
//               value={factorySelect}
//               label="select"
//               onChange={e => setFactorySelect(e.target.value)}
//             >
//               <MenuItem value={'catering'}>קייטרינג</MenuItem>
//               <MenuItem value={'hazor'}>קייטרינג חצור</MenuItem>
//               <MenuItem value={'bakery'}>מאפיה</MenuItem>
//             </Select>
//             <FormHelperText>בחר סניף לשלוח לשם מוצרים</FormHelperText>
//           </FormControl>}
//           <TextField
//             id="outlined-multiline-static"
//             label="הוסף הערה"
//             multiline
//             rows={4}
//             placeholder="רק אוסם!"
//             sx={{ mt: 2, width: '100%' }}
//             onChange={ e => setNote(e.target.value)}
//           />
//           {errorMessage && (
//             <Typography sx={{ color: 'red', mt: 1 }}>
//               {errorMessage}
//             </Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} variant="outlined"
//             sx={{  color: 'red', borderColor: 'red', ml: 1 }} > בטל
//           </Button>
//           <Button variant="outlined" onClick={handleSendInvitation} autoFocus >
//             שלח הזמנה
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

