import React, { useState ,useEffect } from "react";
import { useSelector } from 'react-redux';
import { useGetOldOrdersQuery,
    useRemoveProductInOldOrderMutation,
    useReturnProductMutation,
    useProductReceivedMutation
} from "../dl/api/oldOrdersApi";
import { Camera } from "../components/Camera";
import { defineAbilitiesFor } from '../auth/abilities';
import { IconDeleteButton, IconCameraButton, IconCheckButton,
    IconReturnButton, LoudingPage, AccordionComponent,
    InputNumberQuantity, StackChips, AppBarSystemManagement } from '../components/indexComponents';
import moment from 'moment';
import { Grid, Typography, Link, ListItemText, Divider, Box} from "@mui/material";
import { FilterRow } from "../components/cssComponents/FilterRow";
import { useFilters } from "../components/hooks/useFilters";
import '../css/oldOrders.css';

export const OldOrders = () => {
    const { data: allOldOrders, error: errorGetOldOrders, isLoading: isLoadingGetOldOrders } = useGetOldOrdersQuery();

    const { user } = useSelector( state => state.users);
    const ability = defineAbilitiesFor(user);

    const filterFields = ['category', 'factory', 'unitOfMeasure', 'supplier'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    const sortedByCategory = list => {
        return list.sort((a, b) => a.product.category.localeCompare(b.product.category));
    }

    useEffect( () => {
        if (allOldOrders) {
            console.log(allOldOrders);
            const sortedProducts = allOldOrders.map( order => ({
            ...order, listProducts: sortedByCategory([...order.listProducts])
            }))
            setData(sortedProducts)
        }
    },[allOldOrders]);

    const [valueTab, setValueTab] = useState(1);
    const changeTab = (e, newValue) => {
        setValueTab(newValue)
    }

    // useEffect(() => {
    //     if (!allOldOrders) return;
    //         let oldOrdersFiltered = [...allOldOrders];
    //         oldOrdersFiltered = oldOrdersFiltered.sort((a, b) => a.date > b.date);
    //         const groupBySupplier = oldOrdersFiltered.reduce((acc, order) => {
    //             const nameSupplier = order.supplier.nameSupplier; 
    //             acc[nameSupplier] = acc[nameSupplier] || [];
    //             acc[nameSupplier].push(order);
    //             return acc;
    //         }, {});
    //         setGroupedOrders(groupBySupplier);
    // }, [allOldOrders]);

    if (errorGetOldOrders) return <h3>ERROR: בעיה בטעינה</h3>
    if (isLoadingGetOldOrders) return <LoudingPage />;
    
    return (
        <div>
        <AppBarSystemManagement secondaryTabValue={valueTab} onSecondaryTabChange={changeTab} />
        <Box sx={{display: 'flex', p: 1}}>
          <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allOldOrders}>
            <Box sx={{p: 1}}>
            {filteredData && filteredData.length > 0 ? filteredData.map(invitation => (
                ability.can('read', 'PendingOrders', invitation.factory) ? (
                  <Invitation
                    key={`${invitation._id}-${invitation.listProducts.length}`} 
                    invitation={invitation}
                    supplierName={invitation.supplier.nameSupplier} />
                  ) : null
                )) : <p>אין הזמנות לטיפול</p>}   
            </Box>
          </FilterRow>
      </Box>
        </div>
    );
};


const Invitation = ({invitation, supplierName}) => {
    const { listProducts, factory, date, time, _id, _idSupplier } = invitation;
    // const listProductsSorted = [...listProducts].sort((a, b) => a.category.localeCompare(b.category));
    const [showCamera, setShowCamera] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    return (
        <>
            { showCamera && <Camera setShowCamera={setShowCamera} numberOrder={_id} setImageSrc={setImageSrc}/> }
            <AccordionComponent 
            summary={
                <Grid container spacing={1}  alignItems="center">
                    <Grid item xs={12} sx={{maxHeight: '30px'}}>
                       <StackChips factory={factory} name={supplierName} />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>
                            {_id.substring(0,8)}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography>
                            {time}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>
                            {moment.unix(date).format("DD.MM.YYYY")}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}  sx={{ display: showCamera ? 'none' : 'block' }} >
                        <IconCameraButton action={() => setShowCamera( old => !old)} title='צלם תעודת הזמנה'/> 
                    </Grid>
                    <Grid item xs={12} sx={{ display: imageSrc === '' ? 'none' : 'block' }}>
                        <Link href={`https://deliverycertificate.s3.us-east-1.amazonaws.com/${_id}.jpeg`}>לצפייה בתמונה</Link> 
                    </Grid>
                </Grid>
            } 
            details={
                listProducts.map(order => (
                    <React.Fragment key={order._id}>
                        <Divider sx={{paddingBottom: '1px'}}/>
                        <ShowOldOrder key={`${order._id}-${order.quantity}`}
                        time={time}
                        date={date}
                        factory={factory}
                        _idSupplier={_idSupplier}
                        order={order}
                        idOrderList={_id} />
                    </React.Fragment>
                ))
            }>
            </AccordionComponent>
        </>
    );
};


const ShowOldOrder = props => {
    const { idOrderList, factory, order, time, date, _idSupplier } = props;
    const { quantity, price, product } = order;
    const { _id, nameProduct, unitOfMeasure, category } = product;

    const [productReceived, { error: errorProductReceived }] = useProductReceivedMutation();
    const [returnProduct, { error: errorReturnProduct }] = useReturnProductMutation();
    const [removeProductInOldOrder, { error: errorRemoveProductInOldOrder }] = useRemoveProductInOldOrderMutation();

    const {user} = useSelector( state => state.users);
    const [valueTemporaryQuantity, setValueTemporaryQuantity] = useState(quantity)

    const ProductReceived = async () => {
        try {
            await productReceived({ numberOrder: idOrderList, time, date, factory, _idSupplier,
                product: {...order, temporaryQuantity: valueTemporaryQuantity}}).unwrap();
        }catch (err) { }
    }
    const returnToOrderManagement = () => {
        try {
            returnProduct({nameProduct, factory, quantity,
                unitOfMeasure, category, _id, idOrderList, userName: user.userName,
            }).unwrap();
        }catch (err) { }
    }
    const deleteProduct = () => {
        try {
            removeProductInOldOrder({_id, idOrderList}).unwrap();
        }catch (err) { }
    }

    const handleEditQuantity = e => {
        const newQuantity = Number(e.target.value);
        setValueTemporaryQuantity(newQuantity);
    }
    return (
        <Grid container spacing={2} alignItems={'center'}>
            <Grid item xs={3} sm={1}>
                <InputNumberQuantity  value={valueTemporaryQuantity} setValue={handleEditQuantity}/>
            </Grid>
            <Grid item xs={5} sm={4}>
                <ListItemText primary={nameProduct} secondary={unitOfMeasure} />
            </Grid>
            <Grid item xs={2} sm={2}>
                <ListItemText primary={'מחיר'} secondary={price} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <IconCheckButton action={ProductReceived} 
                    title={errorProductReceived?.message ?? 'אשר קבלת מוצר'}/>
            </Grid>
            <Grid item xs={4} sm={1}>
                <IconReturnButton action={returnToOrderManagement} 
                    title={errorReturnProduct?.message ?? 'החזר מוצר להזמנות בתהליך'} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <IconDeleteButton action={deleteProduct} 
                    title={errorRemoveProductInOldOrder?.message ?? 'מחק מוצר'} />
            </Grid>
        </Grid>
    );
};
