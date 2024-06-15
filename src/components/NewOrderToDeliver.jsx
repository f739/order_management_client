import { useEffect, useState } from "react";
import { handleFormHook } from "./HandleFormHook";
import { useSelector } from "react-redux";
import { useGetSuppliersQuery } from "../dl/api/suppliersApi";
import { useSendOrderFromCartMutation } from "../dl/api/ordersApi";
import { TextField, Button, Typography, Box, DialogActions, ToggleButton, ToggleButtonGroup,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress
 } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { DialogSendInvitation } from "./cssComponents/DialogSendInvitation";  
import '../css/newOrderToDeliver.css';

export const NewOrderToDeliver = ({setShowSendEmail}) => {
    const { cartToDeliver } = useSelector( state => state.orders);
    const [sendOrderFromCart, {error: errorSendOrderFromCart, isLoading: isLoudingSendOrder}] = useSendOrderFromCartMutation()
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [emailForm, setEmailForm] = useState(
        {supplier: [], titleMessage: '', messageContent: '', howToSend: []}
    )
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [showTable, setShowTable] = useState(false);

    useEffect( () => {
        if (cartToDeliver && cartToDeliver.length !== 0) {
            const supplier = allSuppliers.find(
                supplier => supplier._id === cartToDeliver[0]._idSupplier
            );
            setEmailForm(oldForm => ({
                ...oldForm,
                supplier
            }));
        }
    },[allSuppliers, cartToDeliver])

    const handleMethodChange = (event, newMethods) => {
        setEmailForm( oldForm => ({
            ...oldForm,
            howToSend: newMethods
        }))
        setSelectedMethods(newMethods);
    };

    const sendOrder = async () => {
        try {
            await sendOrderFromCart(emailForm).unwrap();
            setShowSendEmail(false);
        }catch (err) { }
    }

    const toggleTable = () => {
        setShowTable(prev => !prev);
    };

    return(
        <DialogSendInvitation setOpenDialog={setShowSendEmail} title="שליחת הזמנה">
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">אל</Typography>
                {emailForm.supplier.nameSupplier && (
                <Typography>{`${emailForm.supplier.nameSupplier} (${emailForm.supplier.email})`}</Typography>
                ) }
            </Box>
            { cartToDeliver.length !== 0  ? (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">מוצרים בהזמנה</Typography>
                <IconButton onClick={toggleTable}>
                {showTable ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            </Box>
            ) : (
                <Typography color="error">לא נבחרו מוצרים!</Typography>
            )}
            { showTable && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table aria-label="cart items table">
                <TableHead>
                    <TableRow>
                    <TableCell align="right">שם מוצר</TableCell>
                    <TableCell align="right">כמות</TableCell>
                    <TableCell align="right">מחיר</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cartToDeliver.map( item => (
                    <TableRow key={item._id}>
                        <TableCell align="right">{item.nameProduct}</TableCell>
                        <TableCell align="right">{item.temporaryQuantity}</TableCell>
                        <TableCell align="right">{item.price}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            )}
            <Box sx={{ mb: 2 }}>
                <TextField
                fullWidth
                label="כותרת"
                name="titleMessage"
                variant="outlined"
                onChange={e => handleFormHook(e.target, setEmailForm)}
                inputProps={{ dir: 'rtl' }}
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                fullWidth
                label="תוכן"
                name="messageContent"
                variant="outlined"
                multiline
                rows={4}
                onChange={e => handleFormHook(e.target, setEmailForm)}
                inputProps={{ dir: 'rtl' }}
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                value={selectedMethods}
                onChange={handleMethodChange}
                aria-label="text formatting"
                >
                <ToggleButton value="email" aria-label="email">
                    <EmailIcon />
                    באמייל
                </ToggleButton>
                <ToggleButton value="whatsapp" aria-label="whatsapp">
                    <WhatsAppIcon />
                    בווצאפ
                </ToggleButton>
                <ToggleButton value="download" aria-label="download">
                    <GetAppIcon />
                    הורדה למכשיר
                </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {errorSendOrderFromCart && (
                <Typography color="error" sx={{ mb: 2 }}>
                {errorSendOrderFromCart.message}
                </Typography>
            )}
            <DialogActions>
                <Button onClick={sendOrder} color="primary" variant="contained" disabled={isLoudingSendOrder}>
                {isLoudingSendOrder ? <CircularProgress size={24} /> : 'שלח הזמנה'}
                </Button>
                <Button onClick={() => setShowSendEmail(false)} color="secondary" variant="outlined">
                בטל הזמנה
                </Button>
            </DialogActions>
        </DialogSendInvitation>       

    )
} 