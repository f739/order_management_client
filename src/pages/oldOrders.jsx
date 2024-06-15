import React from 'react';
import { useState ,useEffect } from "react";
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
    InputNumberQuantity, StackChips } from '../components/indexComponents';
import moment from 'moment';
import { Grid, Typography, Link, ListItemText, Divider} from "@mui/material";
import '../css/oldOrders.css';

export const OldOrders = () => {
    const { data: allOldOrders, error: errorGetOldOrders, isLoading: isLoadingGetOldOrders } = useGetOldOrdersQuery();
    const [groupedOrders, setGroupedOrders] = useState([]);

    const { user } = useSelector( state => state.users);
    const ability = defineAbilitiesFor(user);

    useEffect(() => {
        if (!allOldOrders) return;
            let oldOrdersFiltered = [...allOldOrders];
            oldOrdersFiltered = oldOrdersFiltered.sort((a, b) => a.date > b.date);
            const groupBySupplier = oldOrdersFiltered.reduce((acc, order) => {
                const nameSupplier = order.supplier.nameSupplier; 
                acc[nameSupplier] = acc[nameSupplier] || [];
                acc[nameSupplier].push(order);
                return acc;
            }, {});
            setGroupedOrders(groupBySupplier);
    }, [allOldOrders]);
    if (errorGetOldOrders) return <h3>ERROR: בעיה בטעינה</h3>
    if (isLoadingGetOldOrders) return <LoudingPage />;
    
    return (
        <div className="container-old-orders">
            {Object.entries(groupedOrders).length > 0 && Object.entries(groupedOrders).map(([supplierName, orders]) => (
                <div key={supplierName}>   
                    {orders.map(order => (
                        ability.can('read', 'OldOrder', order.factory) ? (
                            <OldVendorOrders 
                                key={`${order._id}-${order.orderList.length}`}
                                invitation={order}
                                supplierName={supplierName}
                            />
                        ) : null
                    ))}
                </div>
            ))}
        </div>
    );
};


const OldVendorOrders = ({invitation, supplierName}) => {
    const { orderList, factory, date, time, _id, _idSupplier } = invitation;
    const orderListSorted = [...orderList].sort((a, b) => a.category.localeCompare(b.category));
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
                orderListSorted.map(order => (
                    <React.Fragment key={order._id}>
                        <Divider sx={{paddingBottom: '1px'}}/>
                        <ShowOldOrder key={`${order._id}-${order.temporaryQuantity}`}
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
    const { _id, nameProduct, temporaryQuantity, unitOfMeasure, price, category } = order;

    const [productReceived, { error: errorProductReceived }] = useProductReceivedMutation();
    const [returnProduct, { error: errorReturnProduct }] = useReturnProductMutation();
    const [removeProductInOldOrder, { error: errorRemoveProductInOldOrder }] = useRemoveProductInOldOrderMutation();

    const {user} = useSelector( state => state.users);
    const [valueTemporaryQuantity, setValueTemporaryQuantity] = useState(temporaryQuantity)

    const ProductReceived = async () => {
        try {
            await productReceived({ numberOrder: idOrderList, time, date, factory, _idSupplier,
                product: {...order, temporaryQuantity: valueTemporaryQuantity}}).unwrap();
        }catch (err) { }
    }
    const returnToOrderManagement = () => {
        try {
            returnProduct({nameProduct, factory, temporaryQuantity,
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
