import { useState, useEffect } from "react"; 
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from "../dl/slices/products";
import { getCategories } from "../dl/slices/categories";
import { sendAnInvitation } from "../dl/slices/orders";
import { ItemsBox } from "../components/ItemsBox";
import { SelectCatgoryHook } from "../components/SelectCatgoryHook";
import { DialogSendOrder } from "../components/cssComponents/DialogSendOrder";
import {Button, Box } from '@mui/material';
import '../css/orders.css'

export const Orders = () => {
    const dispatch = useDispatch();
    const {allProducts, isLoading} = useSelector( state => state.products);
    const { user } = useSelector( state => state.users);
    const {allCategories} = useSelector( state => state.categories);
    const [productsOfLicense, setProductsOfLicense] = useState([]);
    const [itemsListFiltered, setItemsListFiltered] = useState([]);
    const [catgorySelected, setCategorySelected] = useState('allCategories')
    const [showSelect, setShowSelect] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(getProducts());
        }
        if (!allCategories || allCategories.length === 0) {
            dispatch( getCategories())
        }
    }, []);
    useEffect(() => {
        if (user.license === 'purchasingManager') {
            const sortedProducts = [...allProducts].sort((a, b) => a.category.localeCompare(b.category));
            setProductsOfLicense(sortedProducts);
            setItemsListFiltered(sortedProducts);
        }else {
            const sortedProducts = [...allProducts]
            .filter( product => product.factory === user.factory)
            .sort((a, b) => a.category.localeCompare(b.category))
            setProductsOfLicense(sortedProducts);
            setItemsListFiltered(sortedProducts);
        }
    }, [allProducts]);
    
    const filterProducts = value => {
        if (value === 'allCategories') {
            setItemsListFiltered( productsOfLicense);
        }else {
            setItemsListFiltered( () => productsOfLicense.filter( product => product.category === value));
        }
    }

    const SendAnInvitation = (whichFactoryToSend, note) => {
        dispatch( sendAnInvitation({user, whichFactoryToSend, note}));
    }

    if (isLoading) return <h1>🌀 Loading...</h1>;
    return(
        <div className="container-orders">
            <SelectCatgoryHook set={filterProducts} form={catgorySelected} ifFunc={true} />
            { itemsListFiltered && itemsListFiltered.map( item => (
                <div className="box-item"  key={item._id}>
                    <ItemsBox nameProduct={item.nameProduct} 
                    factory={item.factory}
                    temporaryQuantity={item.temporaryQuantity} 
                    unitOfMeasure={item.unitOfMeasure}
                    category={item.category}
                    note={item.note}
                    _id={item._id}/>
                </div>
            ))}

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