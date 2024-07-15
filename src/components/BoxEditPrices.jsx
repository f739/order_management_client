import React from 'react';
import { useEffect, useState } from 'react';
import { handleFormHook } from './HandleFormHook';
import { useGetSuppliersQuery } from '../dl/api/suppliersApi';
import { useAddPriceMutation, useDeletePriceMutation } from '../dl/api/productsApi';
import '../css/boxPrice.css';
import { DialogSendInvitation } from './cssComponents/DialogSendInvitation';
import { CustomField, CustomSelect, LoudingPage } from './indexComponents';
import { AppBar, Tabs, Tab, Button, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fieldsAreNotEmpty } from './hooks/fanksHook';

export const BoxEditPrices = props => {
    const { product, setShowEditPrices } = props;
    const [updatedPrices, setUpdatedPrices] = useState([]);
    const [ addPrice, {error: errorAddPrice, isLoading: isLoadingAddPrice}] = useAddPriceMutation();
    const [valueTab, setValueTab] = useState(1);
    const handleEditPrices = objPrice => {
        setUpdatedPrices(prev => {
            if (prev.length === 0) {
                return [objPrice];
            }
            const index = prev.findIndex(item => item._idSupplier === objPrice._idSupplier);
            if (index !== -1) {
                return prev.map(item => 
                    item._idSupplier === objPrice._idSupplier ? objPrice : item
                );
            } else {
                return [...prev, objPrice];
            }
        });
    };
    
    const handleUpdatePrices = async () => {
      try {
        await addPrice(updatedPrices).unwrap();
        setShowEditPrices(false)
      }catch (err) { }
    }

    const handleTabChange = (e, newValue) => {
        setValueTab(newValue)
    }

    return (
        <>
            <DialogSendInvitation 
                title={`מחירים של: ${product.nameProduct}`}
                labelConfirm="שמור"
                setOpenDialog={() => setShowEditPrices(false)}
                isLoudingSendOrder={isLoadingAddPrice}
                sendOrder={handleUpdatePrices}
                cart={false}
                errorMessage={errorAddPrice}
                sxBox={{p: 0, minWidth: '300px', display: 'flex', flexDirection: 'column', height: '400px'}}
                fields={ 
                <>
                    <AppBar position="static" color="default" sx={{ flexShrink: 0 }} >
                        <Tabs
                            value={valueTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label='מחירים קיימים' />
                            <Tab label='מחיר חדש' />
                        </Tabs>
                    </AppBar>
                    <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto'}}>
                        {valueTab === 0 ? (
                            product.price.length > 0 ? product.price.map( price => (
                                <ShowCurrentPrices 
                                    key={price._id}
                                    price={price} 
                                    _idProduct={product._id} 
                                    handleEditPrices={handleEditPrices} 
                                />  
                            )) : <Typography>אין מחירים להצגה</Typography>
                        ) : (
                            <CreateNewPrices  
                                product={product}
                                handleEditPrices={handleEditPrices}
                                handleUpdatePrices={handleUpdatePrices}
                            />
                        )}
                    </Box>
                </>
                }
            />
        </>
    )
}

const ShowCurrentPrices = props => {
    const { price, _idProduct, handleEditPrices } = props;
    const [deletePrice, {error: errorDeletePrice, isLoading: isLoadingDeletePrice}] = useDeletePriceMutation();
    const [formEditPrice, setFormEditPrice] = useState(
        {price: price.price, _idSupplier: price._idSupplier._id, _idProduct}
    );

    const handleChangePrice = target => {
        if (!/^\d*\.?\d+$/.test(target.value) && '') return;
        const updatedPrice = {
            ...formEditPrice,
            [target.name]: target.value
        };
        setFormEditPrice(updatedPrice);
        handleEditPrices(updatedPrice);
    }

    const handleDeletePrice = async priceId => {
        console.log('aaa');
        try {
            await deletePrice(priceId).unwrap();
        }catch (err) {}
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{price._idSupplier.nameSupplier}</Typography>
                <IconButton 
                    onClick={() => handleDeletePrice(price._id)}
                    disabled={!price._idSupplier.active}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
            <CustomField 
                name='price'
                value={formEditPrice.price}
                label='מחיר'
                onChange={e => handleChangePrice(e.target)}
                type='text'
                disabled={!price._idSupplier.active}
            />
      </Box>
    )
}

const CreateNewPrices = props => {
    const { product, handleEditPrices } = props;
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [formNewPrice, setFormNewPrice] = useState(
        {price: '', _idSupplier: '', _idProduct: product._id}
    );

    useEffect( () => {
        if (fieldsAreNotEmpty(formNewPrice)) {
            handleEditPrices(formNewPrice)
        }
    },[formNewPrice]);

    const getActiveSupplierWithoutPrice = () => {
        if (!allSuppliers || !product.price) return [];
        const supplierIdsWithPrice = new Set(product.price.map(p => p._idSupplier._id));
        return allSuppliers.filter(supplier => 
            supplier.active && !supplierIdsWithPrice.has(supplier._id)
        );
    };
    
    if (isLoadingGetsuppliers) return <LoudingPage />
    return (
      <>
        <CustomSelect 
            set={setFormNewPrice} 
            nameField='_idSupplier'
            value={formNewPrice._idSupplier} 
            label='ספק'
            options={getActiveSupplierWithoutPrice()} 
            optionsValue='nameSupplier'
            optionsValueToShow='_id'
        />
        <CustomField 
            name='price'
            value={formNewPrice.price}
            label='מחיר'
            onChange={e => handleFormHook(e.target, setFormNewPrice)}
            type='number'
        />
      </>
    )
  }  