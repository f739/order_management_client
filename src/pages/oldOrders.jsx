import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import {
    useGetOldOrdersQuery,
    useRemoveProductInOldOrderMutation,
    useReturnProductMutation,
    useProductReceivedMutation
} from "../dl/api/oldOrdersApi";
import { Camera } from "../components/Camera";
import { defineAbilitiesFor } from '../auth/abilities';
import {
    IconDeleteButton, IconCameraButton, IconCheckButton,
    IconReturnButton, LoudingPage, AccordionComponent,
    InputNumberQuantity, StackChips, AppBarSystemManagement,
    ErrorPage
} from '../components/indexComponents';
import moment from 'moment';
import { Grid, Typography, Link, ListItemText, Divider, Box, IconButton, Collapse } from "@mui/material";
import { FilterRow } from "../components/filters/FilterRow";
import { useFilters } from "../hooks/useFilters";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

export const OldOrders = () => {
    const { data: allOldOrders, error: errorGetOldOrders, isLoading: isLoadingGetOldOrders } = useGetOldOrdersQuery();

    const { user } = useSelector(state => state.users);
    const ability = defineAbilitiesFor(user);

    const filterFields = ['category', 'branch', 'unitOfMeasure', 'supplier'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    const sortedByCategory = list => {
        return list.sort((a, b) => a.product.category?.nameCategory.localeCompare(b.product.category?.nameCategory));
    }

    useEffect(() => {
        if (allOldOrders) {
            console.log(allOldOrders);
            const sortedProducts = allOldOrders.map(order => ({
                ...order, listProducts: sortedByCategory([...order.listProducts])
            }))
            setData(sortedProducts)
        }
    }, [allOldOrders]);

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

    if (errorGetOldOrders) return <ErrorPage error={errorGetOldOrders} />
    if (isLoadingGetOldOrders) return <LoudingPage />;

    return (
        <div>
            <AppBarSystemManagement secondaryTabValue={valueTab} onSecondaryTabChange={changeTab} />
            <Box sx={{ display: 'flex', p: 1 }}>
                <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allOldOrders}>
                    <Box sx={{ p: 1 }}>
                        {filteredData && filteredData.length > 0 ? filteredData.map(invitation => (
                            ability.can('read', 'PendingOrders', invitation.branch._id) ? (
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


const Invitation = ({ invitation, supplierName }) => {
    const { listProducts, branch, date, time, _id, _idSupplier } = invitation;
    // const listProductsSorted = [...listProducts].sort((a, b) => a.category.localeCompare(b.category));
    const [showCamera, setShowCamera] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    return (
        <>
            {showCamera && <Camera setShowCamera={setShowCamera} numberOrder={_id} setImageSrc={setImageSrc} />}
            <AccordionComponent
                summary={
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sx={{ maxHeight: '30px' }}>
                            <StackChips branch={branch} name={supplierName} />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>
                                {_id.substring(0, 8)}
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
                        <Grid item xs={1} sx={{ display: showCamera ? 'none' : 'block' }} >
                            <IconCameraButton action={() => setShowCamera(old => !old)} title='צלם תעודת הזמנה' />
                        </Grid>
                        <Grid item xs={12} sx={{ display: imageSrc === '' ? 'none' : 'block' }}>
                            <Link href={`https://deliverycertificate.s3.us-east-1.amazonaws.com/${_id}.jpeg`}>לצפייה בתמונה</Link>
                        </Grid>
                    </Grid>
                }
                details={
                    listProducts.map(order => (
                        <React.Fragment key={order._id}>
                            <Divider sx={{ paddingBottom: '1px' }} />
                            <ShowOldOrder key={`${order._id}-${order.quantity}`}
                                time={time}
                                date={date}
                                branch={branch}
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
    const { idOrderList, branch, order, time, date, _idSupplier } = props;
    const { quantity, price, product } = order;
    const { _id, nameProduct, unitOfMeasure, category } = product;
    
    const [showIcons, setShowIcons] = useState(false);
    const [productReceived, { error: errorProductReceived }] = useProductReceivedMutation();
    const [returnProduct, { error: errorReturnProduct }] = useReturnProductMutation();
    const [removeProductInOldOrder, { error: errorRemoveProductInOldOrder }] = useRemoveProductInOldOrderMutation();

    const { user } = useSelector(state => state.users);
    const [valueTemporaryQuantity, setValueTemporaryQuantity] = useState(quantity)

    const ProductReceived = async () => {
        try {
            await productReceived({
                numberOrder: idOrderList, time, date, branch, _idSupplier,
                product: { ...order, temporaryQuantity: valueTemporaryQuantity }
            }).unwrap();
        } catch (err) { }
    }
    const returnToOrderManagement = () => {
        try {
            returnProduct({
                nameProduct, branch, quantity,
                unitOfMeasure: unitOfMeasure._id, category: category._id, _id, idOrderList, userName: user.userName,
            }).unwrap();
        } catch (err) { }
    }
    const deleteProduct = () => {
        try {
            removeProductInOldOrder({ _id, idOrderList }).unwrap();
        } catch (err) { }
    }

    const handleEditQuantity = e => {
        const newQuantity = Number(e.target.value);
        setValueTemporaryQuantity(newQuantity);
    }
    return (
        <Grid container spacing={1} alignItems='center' sx={{p: 1}} justifyContent="space-between">
            <Grid item >
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    {nameProduct}
                </Typography>
                <InputNumberQuantity value={valueTemporaryQuantity} setValue={handleEditQuantity} />
            </Grid>
            <Grid item>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    מחיר
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {price}
                </Typography>
            </Grid> 
                {showIcons && (
                <Grid item sx={{order: {xs: 1 ,sm: 0}}}>
                    <Grid container spacing={1} direction="row" sx={{justifyContent: 'end'}} >
                        <Grid item>
                            <IconCheckButton
                                action={ProductReceived}
                                title={errorProductReceived?.message ?? 'אשר קבלת מוצר'}
                            />
                        </Grid>
                        <Grid item>
                            <IconReturnButton
                                action={returnToOrderManagement}
                                title={errorReturnProduct?.message ?? 'החזר מוצר להזמנות בתהליך'}
                            />
                        </Grid>
                        <Grid item>
                            <IconDeleteButton
                                action={deleteProduct}
                                title={errorRemoveProductInOldOrder?.message ?? 'מחק מוצר'}
                            />
                        </Grid>
                    </Grid>
            </Grid>
                )}
                <Grid item sx={{order: {xs: 0 ,sm: 1}}}>
                <IconButton onClick={() => setShowIcons( old => !old)}>
                    <MoreVertOutlinedIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};
