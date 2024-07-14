import { useState, useEffect } from "react"; 
import { useSelector, useDispatch } from 'react-redux';
import { useGetProductsQuery } from '../dl/api/productsApi';
import { useSendAnInvitationMutation } from "../dl/api/ordersApi";
import { defineAbilitiesFor } from '../auth/abilities';
import { actions } from "../dl/slices/orders";
import { StackChips, IconRemoveButton, IconAddButton, ChangeQuantity, LoudingPage, AppBarSystemManagement, TooltipComponent } from "../components/indexComponents";
import { Fab, Box, Stack, Paper, Divider, Grid, ListItemText, Typography, 
    TextField, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { DialogSendInvitation } from "../components/cssComponents/DialogSendInvitation";
import { FilterRow } from "../components/cssComponents/FilterRow";
import { useFilters } from "../components/hooks/useFilters";
import '../css/orders.css';

export const Orders = () => {
    const { data: allProducts, error: errorGetProducts, isLoading: isLoadingGetProducts } = useGetProductsQuery();
    const [sendAnInvitation, { error: errorSendAnInvitation, isLoading: isLoadingSendInvitaion }] = useSendAnInvitationMutation();
    const { user } = useSelector( state => state.users);
    const { cartToBookingManager, errorCartToBookingManager } = useSelector( state => state.orders);

    const ability = defineAbilitiesFor(user);

    const [openDialog, setOpenDialog] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [noteToOrder, setNoteToOrder] = useState('');
    const filterFields = ['category', 'factory', 'unitOfMeasure'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect( () => {
        if (allProducts) {
            const sortedProducts = [...allProducts]
            .sort((a, b) => a.category.localeCompare(b.category));
            setData(sortedProducts)
        }
    },[allProducts]);

    const SendAnInvitation = async () => {
        try {
            await sendAnInvitation(
                {user, whichFactoryToSend: cartToBookingManager[0]?.factory, noteToOrder}
            ).unwrap();
            setOpenDialog(false);
        }catch (err) {
            console.log(err, errorSendAnInvitation);
        }
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        padding: '20px 20px 0px 0px'
      }));

    const [valueTab, setValueTab] = useState(1);

    const changeTab = (e, newValue) => {
        setValueTab(newValue)
    }
    
    if (errorGetProducts) return <h3>ERROR: {errorGetProducts.error}</h3>
    if (isLoadingGetProducts) return <LoudingPage />;
   
    return(
        <>
            <AppBarSystemManagement secondaryTabValue={valueTab} onSecondaryTabChange={changeTab} />
            <Box sx={{display: 'flex', p: 1}}>
                <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allProducts}>
                    <Stack
                    sx={{p: 1}}
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={1}
                    >
                        { filteredData.length > 0 ? (
                            filteredData.map( (item, i) => (
                                <Item key={item._id}>
                                    {ability.can('read', 'Order', item.factory) ? (
                                        <div>
                                            <ItemsBox item={item} />
                                            {i < filteredData.length - 1 && <Divider />}
                                        </div>
                                    ) : null}
                                </Item>
                            ))) : <Typography>אין מוצרים להצגה</Typography>
                        }
                    </Stack>
                    {/* <TooltipComponent title='שלח הזמנה'> */}
                        <Fab 
                            color="primary" 
                            onClick={() => setOpenDialog(true)}
                            sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                            }}
                        >
                            <SendIcon />
                        </Fab>
                    {/* </TooltipComponent> */}
                </FilterRow>
                { openDialog && <DialogSendInvitation 
                    setOpenDialog={setOpenDialog} 
                    isLoudingSendOrder={isLoadingSendInvitaion}
                    showTable={showTable}
                    setShowTable={setShowTable}
                    errorMessage={errorSendAnInvitation}
                    cart={cartToBookingManager}
                    sendOrder={SendAnInvitation}
                    user={user} 
                    to={ cartToBookingManager.length > 0 ? cartToBookingManager[0].factory : null }
                    tableHead={
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">קטגוריה</TableCell>
                                <TableCell align="right">שם מוצר</TableCell>
                                <TableCell align="right">יחידת מידה</TableCell>
                                <TableCell align="right">כמות</TableCell>
                            </TableRow>
                        </TableHead>
                    }
                    tableBody={
                        <TableBody>
                            {cartToBookingManager.map( item => (
                                <TableRow key={item._id}>
                                    <TableCell align="right">{item.category}</TableCell>
                                    <TableCell align="right">{item.nameProduct}</TableCell>
                                    <TableCell align="right">{item.unitOfMeasure}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody> 
                    }
                    fields={
                        <TextField
                            id="outlined-multiline-static"
                            label="הוסף הערה"
                            multiline
                            rows={4}
                            placeholder="שים לב ל..."
                            sx={{ mt: 2, width: '100%', minWidth: '300px' }}
                            onChange={ e => setNoteToOrder(e.target.value)}
                        />
                    }
                />}
            </Box>
        </>
    )
}

const ItemsBox = ({ item }) => {
    const dispatch = useDispatch();
    const { nameProduct, factory, _id, category, unitOfMeasure } = item;
    
    const productActive = useSelector( state => {
        return state.orders.cartToBookingManager.find( pr => pr._id === _id);
    });
    const { errorIncrease, errorChangeQuantity } = useSelector(state => state.orders.errorCartToBookingManager);
    
    const onIncrease = () => {
        dispatch( actions.increaseOne({...item}))
    }
    const onDecrease = () => {
        dispatch( actions.decreaseOne(_id))
    }
    const onChangeQuantity = e => {
        const {value} = e.target;
        dispatch( actions.changeQuantityToBookingManager(
            {...item, quantity: value}
        ))
    }
    
    return (    
        <Grid container spacing={1} alignItems="start" 
        textAlign='start' justifyContent='space-between' sx={{paddingLeft: '20px'}}>
            <Grid item xs={12}>   
                <StackChips factory={factory} catgory={category} />
            </Grid>
            <Grid item>
                <ListItemText primary={nameProduct} secondary={unitOfMeasure} />
            </Grid>
            <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconRemoveButton action={onDecrease} title={'הפחת כמות'} />
                    <ChangeQuantity 
                        action={onChangeQuantity} 
                        quantity={productActive?.quantity ?? 0} 
                        title={errorChangeQuantity ? errorChangeQuantity : 'שנה כמות'} />
                    <IconAddButton action={onIncrease} title={errorIncrease ? errorIncrease : 'הוסף כמות'} />
                </Box>
            </Grid>
        </Grid>
    )
}