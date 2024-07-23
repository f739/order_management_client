import { useEffect, useState } from "react";
import { handleFormHook } from "../hooks/HandleFormHook";
import { useSelector } from "react-redux";
import { useGetSuppliersQuery } from "../dl/api/suppliersApi";
import { useSendOrderFromCartMutation } from "../dl/api/ordersApi";
import {
    TextField, Typography, Box, ToggleButton, ToggleButtonGroup,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import {
    Email as EmailIcon, WhatsApp as WhatsAppIcon, GetApp as GetAppIcon,
} from '@mui/icons-material';

import { DialogSendInvitation } from "./DialogSendInvitation";

export const NewOrderToDeliver = ({ setShowSendEmail }) => {
    const { cartToDeliver } = useSelector(state => state.orders);
    const [sendOrderFromCart, { error: errorSendOrderFromCart, isLoading: isLoudingSendOrder }] = useSendOrderFromCartMutation()
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [emailForm, setEmailForm] = useState(
        { supplier: [], titleMessage: '', messageContent: '', howToSend: [] }
    )
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        if (cartToDeliver && cartToDeliver.length !== 0) {
            const supplier = allSuppliers.find(
                supplier => supplier._id === cartToDeliver[0]._idSupplier
            );
            setEmailForm(oldForm => ({
                ...oldForm,
                supplier
            }));
        }
    }, [allSuppliers, cartToDeliver])

    const handleMethodChange = (event, newMethods) => {
        setEmailForm(oldForm => ({
            ...oldForm,
            howToSend: newMethods
        }))
        setSelectedMethods(newMethods);
    };

    const sendOrder = async () => {
        try {
            await sendOrderFromCart(emailForm).unwrap();
            setShowSendEmail(false);
        } catch (err) { }
    }

    return (
        <DialogSendInvitation setOpenDialog={setShowSendEmail}
            sendOrder={sendOrder}
            isLoudingSendOrder={isLoudingSendOrder}
            showTable={showTable}
            setShowTable={setShowTable}
            cart={cartToDeliver}
            errorMessage={errorSendOrderFromCart}
            to={emailForm.supplier.nameSupplier ?
                `${emailForm.supplier.nameSupplier} (${emailForm.supplier.email})` : null
            }
            tableHead={
                <TableHead>
                    <TableRow>
                        <TableCell align="right">שם מוצר</TableCell>
                        <TableCell align="right">כמות</TableCell>
                        <TableCell align="right">מחיר</TableCell>
                    </TableRow>
                </TableHead>
            }
            tableBody={
                <TableBody>
                    {cartToDeliver.map(item => (
                        <TableRow key={item._id}>
                            <TableCell align="right">{item.nameProduct}</TableCell>
                            <TableCell align="right">{item.temporaryQuantity}</TableCell>
                            <TableCell align="right">{item.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            }
            fields={
                <>
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
                </>
            }
            moreActions={
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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
            }
        >
        </DialogSendInvitation>
    )
} 