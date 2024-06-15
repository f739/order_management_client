import { useState, useEffect } from "react"; 
import { useSelector, useDispatch } from 'react-redux';
import { ItemsBox } from "../components/ItemsBox";
import { SelectCatgoryHook } from "../components/SelectCatgoryHook";
import { useGetProductsQuery } from '../dl/api/productsApi';
import { useSendAnInvitationMutation } from "../dl/api/ordersApi";
import { DialogSendOrder } from "../components/cssComponents/DialogSendOrder";
import { defineAbilitiesFor } from '../auth/abilities';
import { Button, Box, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

import '../css/orders.css'
import { LoudingPage } from "../components/indexComponents";

export const Orders = () => {
    const { data: allProducts, error: errorGetProducts, isLoading: isLoadingGetProducts } = useGetProductsQuery();
    const [sendAnInvitation, { error: errorSendAnInvitation, isLoading: isLoadingSendInvitaion }] = useSendAnInvitationMutation();
    const { user } = useSelector( state => state.users);

    const ability = defineAbilitiesFor(user);

    const [allProductsFiltred, setAllProductsFiltred] = useState([]);
    const [catgorySelected, setCategorySelected] = useState('allCategories')
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (!allProducts) return;
        let sortedProducts = [...allProducts].sort((a, b) => a.category.localeCompare(b.category));

        if (catgorySelected !== 'allCategories') {
            sortedProducts = sortedProducts.filter(order => order.category === catgorySelected)
        }
        setAllProductsFiltred(sortedProducts);
       
    }, [allProducts, catgorySelected]);

    const SendAnInvitation = (whichFactoryToSend, note) => {
        try {
            sendAnInvitation({user, whichFactoryToSend, note});
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

    if (errorGetProducts) return <h3>ERROR: {errorGetProducts.error}</h3>
    if (isLoadingGetProducts) return <LoudingPage />;
   
    return(
        <div >
            <SelectCatgoryHook set={setCategorySelected} form={catgorySelected} ifFunc={true} />
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={1}
            >
            { allProductsFiltred && allProductsFiltred.map( (item, i) => (
                    <Item key={item._id}>
                        {ability.can('read', 'Order', item.factory) ? (
                            <div >
                                <ItemsBox nameProduct={item.nameProduct} 
                                factory={item.factory}
                                temporaryQuantity={item.temporaryQuantity} 
                                unitOfMeasure={item.unitOfMeasure}
                                category={item.category}
                                note={item.note}
                                _id={item._id}/>
                            {i < allProductsFiltred.length - 1 && <Divider />}
                            </div>
                        ) : null}
                    </Item>
                    ))}
                </Stack>

    <Box sx={{ position: 'fixed', bottom: 16, right: 16}}>
        <Button variant="contained" className="send-an-invitation" onClick={() => setOpenDialog(true)} >
        שלח הזמנה
        </Button>
    </Box>
         { openDialog && <DialogSendOrder 
            setOpenDialog={setOpenDialog} 
            SendAnInvitation={SendAnInvitation}
            user={user} />}
        </div>
    )
}