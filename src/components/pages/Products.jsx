import React, { useState, useEffect } from "react";
import { handleFormHook } from '../HandleFormHook';
import { DialogSendInvitation } from "../cssComponents/DialogSendInvitation";
import {
    useGetProductsQuery,
    useCreateNewProductMutation,
    useRemoveProductMutation,
    useEditProductMutation
} from '../../dl/api/productsApi';
import { factories } from "../../data/roles";
import { useGetCategoriesQuery } from "../../dl/api/categoriesApi";
import { useGetMeasuresQuery } from "../../dl/api/measuresApi";
import { useGetSuppliersQuery } from "../../dl/api/suppliersApi";
import { AppBarSystemManagement, LoudingPage, CustomField, CustomSelect, SelectFactoryMultipleHook } from "../indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Chip, Divider, IconButton, ListItemText, FormControlLabel, Switch } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { FilterRow } from "../cssComponents/FilterRow";
import { useFilters } from '../hooks/useFilters';
import { BoxEditPrices } from "../BoxEditPrices";

export const Products = () => {
    const [newProduct, setNewProduct] = useState({ nameProduct: '', factories: [], category: '', unitOfMeasure: '', sku: '', price: [] });
    const [newPrice, setNewPrice] = useState({ _idSupplier: '', price: '', nameSupplier: '' });

    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();

    const [createNewProduct, { error, isLoading: isLoadingCreateProdact, data: dataCreateProduct }] = useCreateNewProductMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור מוצר חדש', 'מוצרים פעילים', 'מוצרים שאינם פעילים'];

    const fields = [
        { label: 'שם מוצר', type: 'input', typeInput: 'text', name: 'nameProduct' },
        { label: 'מק"ט', type: 'input', typeInput: 'text', name: 'sku' },
        { label: 'קטגוריה', type: 'select', name: 'category', options: allCategories, optionValue: 'nameCategory' },
        { label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure', options: allMeasures, optionValue: 'measureName' },
        // { label: 'מפעל', type: 'select', name: 'factory', options: factories, optionValue: 'name' },
        // { label: 'מחירים', type: 'button', name: 'price', element: <BoxEditPrices /> },
    ];

    const handleSaveNewPrice = () => {
        if (newPrice._idSupplier === '' || newPrice.price === '' || !/^\d*\.?\d+$/.test(newPrice.price)) return;
        if (newProduct.price.some(prod => prod._idSupplier === newPrice._idSupplier)) return;
        setNewProduct(prev => {
            const supplierIndex = prev.price.findIndex(supplier => supplier._id === newPrice._idSupplier);
            let updatedPrice = [...prev.price];
            if (supplierIndex !== -1) {
                updatedPrice[supplierIndex] = { ...updatedPrice[supplierIndex], price: newPrice.price };
            } else {
                updatedPrice = [...updatedPrice, newPrice];
            }
            return {
                ...prev,
                price: updatedPrice
            };
        });
        setNewPrice({ _idSupplier: '', price: '' });
    }

    const handleDeletePrice = i => {
        setNewProduct(old => {
            const newPriceArray = [...old.price];
            newPriceArray.splice(i, 1);
            return { ...old, price: newPriceArray };
        });
    };

    const handleSelectFactory = newFactories => {
        setNewProduct(old => { return { ...old, factories: newFactories}})
    }

    const handleSaveNewProduct = async () => {
        try {
            await createNewProduct(newProduct).unwrap();
            setNewProduct({ nameProduct: '', factories: [], category: '', unitOfMeasure: '', sku: '', price: [] });
        } catch (err) { console.log(err) }
    }

    const getDetalesSupplier = _idSupplier => {
        return allSuppliers?.find(supp => supp._id === _idSupplier);
    }

    const changeTab = (e, newValue) => {
        setSecondaryTabValue(newValue)
    }
    if (isLoadingGetCategories || isLoadingGetMeasures || isLoadingGetsuppliers) return <LoudingPage />;

    return (
        <Box sx={{
        bgcolor: 'background.paper',
        position: 'relative',
        minHeight: 500,
        boxShadow: '1px 1px 4px',
        margin: '0px 5px'
    }}>
        <AppBarSystemManagement 
            secondaryTabs={secondaryTabs} 
            secondaryTabValue={secondaryTabValue} 
            onSecondaryTabChange={changeTab} 
        />
        {secondaryTabValue === 0 ?
            (<Stack sx={{ p: '20px' }} spacing={1}>
                { fields.map( field => (
                     <React.Fragment key={field.name}>
                        {field.type === 'input' ? 
                            <CustomField 
                                name={field.name}
                                value={newProduct[field.name] || ''}
                                label={field.label}
                                onChange={e => handleFormHook(e.target, setNewProduct)}
                            /> : field.type === 'select' ?
                            <CustomSelect 
                                set={setNewProduct} 
                                nameField={field.name}
                                value={newProduct[field.name] || ''} 
                                label={field.label}
                                options={field.options} 
                                optionsValue={field.optionValue}
                            /> :
                            null
                        }
                     </React.Fragment>
                ))}
                <Box>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} >
                             מחירים: 
                            {newProduct.price && newProduct.price.map((price, i) => (
                                <>
                                { console.log(price)}                               
                                    <Chip sx={{marginRight: '5px'}} variant="outlined" color="success" size="small" key={price._idSupplier}
                                        label={`${getDetalesSupplier(price._idSupplier)?.nameSupplier || ''} - ${price.price}`}
                                        onDelete={() => handleDeletePrice(i)} 
                                    />
                                
                                </>
                            ))}
                        </Grid>
                        <Grid item xs={6} >
                            <CustomSelect 
                                set={setNewPrice} 
                                nameField='_idSupplier'
                                value={newPrice._idSupplier} 
                                label='ספק'
                                options={allSuppliers} 
                                optionsValue='nameSupplier'
                                optionsValueToShow='_id'
                            />
                        </Grid>
                        <Grid item xs={3} >
                            <CustomField 
                                name="price"
                                value={newPrice.price}
                                label='מחיר'
                                onChange={e => handleFormHook(e.target, setNewPrice)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button color="primary" variant="contained" onClick={handleSaveNewPrice}>
                                שמור מחיר
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <SelectFactoryMultipleHook set={handleSelectFactory} form={newProduct} />

                {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                {dataCreateProduct && <Typography variant="button" color="success">{dataCreateProduct.message}</Typography>}
                <Button onClick={handleSaveNewProduct} color="primary" variant="contained" disabled={isLoadingCreateProdact}>
                    {isLoadingCreateProdact ? <CircularProgress size={24} /> : 'שמור'}
                </Button>
            </Stack>) : 
            <ShowProducts secondaryTabValue={secondaryTabValue} />
        }
    </Box>
    )
}

const ShowProducts = ({secondaryTabValue}) => {
    const { data: allProducts, error: errorGetProducts, isLoading: isLoadingGetProducts } = useGetProductsQuery();
    const [showEditProduct, setShowEditProduct] = useState('');
    console.log(allProducts);
    const filterFields = ['category', 'factory', 'unitOfMeasure'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect( () => {
        if (allProducts) {
            setData(allProducts)
        }
    },[allProducts]);

    const [productsActive, productsOff] = filteredData.reduce((result, product) => {
        if (product.active) {
            result[0].push(product);
        } else {
            result[1].push(product);
        }
        return result;
    }, [[], []]);

    if (errorGetProducts) return <h3>ERROR: {errorGetProducts.error}</h3>
    if (isLoadingGetProducts) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} >
                <Box sx={{ p: 2 }}>
                {(secondaryTabValue === 1 ? productsActive : productsOff).length > 0 ? (
                    (secondaryTabValue === 1 ? productsActive : productsOff).map(product => (
                            <div key={product._id}>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item xs={5} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={product.nameProduct}
                                            secondary={product.factory}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={product.category}
                                            secondary={product.unitOfMeasure}
                                        />
                                    </Grid>
                                    <Grid item xs={1} >
                                        <IconButton onClick={() => setShowEditProduct(product)}>
                                            <MoreVertOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider />
                                {showEditProduct._id === product._id &&
                                    <EditProduct 
                                        product={product}
                                        setShowEditProduct={setShowEditProduct}
                                    />
                                }
                            </div>
                        ))) : (<Typography>אין מוצרים להצגה</Typography>)
                    }
                </Box>
            </FilterRow>
        </Box>
    )
}

const EditProduct = props => {
    const { product, setShowEditProduct } = props;

    const [removeProduct, { error: errorRemoveProduct, isLoading: isLoudingDelete }] = useRemoveProductMutation();
    const [editProduct, { error: errorEdit, isLoading: isLoadingEdit }] = useEditProductMutation();
    const [formEdit, setFormEdit] = useState(product);
    const [showEditPrices, setShowEditPrices] = useState(false);
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    
    const fields = [
        { label: 'שם מוצר', type: 'input', typeInput: 'text', name: 'nameProduct' },
        { label: 'מק"ט', type: 'input', typeInput: 'text', name: 'sku' },
        { label: 'מפעל', type: 'select', name: 'factory', options: factories, optionValue: 'name' },
        { label: 'קטגוריה', type: 'select', name: 'category', options: allCategories, optionValue: 'nameCategory' },
        { label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure', options: allMeasures, optionValue: 'measureName' },
        { label: 'מחירים', type: 'button', name: 'price', 
            element: <BoxEditPrices product={product} setShowEditPrices={setShowEditPrices} /> },
    ];

    const handleEditItem = async productUpdated => {
        try {
            await editProduct(productUpdated).unwrap();
            setShowEditProduct('');
        }catch (err) {}
    }

    const deleteProduct = async _id => {
        try {
            await removeProduct(_id).unwrap();
            setShowEditProduct('');
        } catch (err) { }
    }

    return (
        <DialogSendInvitation 
            title='ערוך מוצר'
            cart={false}
            setOpenDialog={setShowEditProduct}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveProduct?.data || errorRemoveProduct}
            labelDelete="מחק לצמיתות"
            actionDelete={() => deleteProduct(product._id)}
            isLoadingDelete={isLoudingDelete}
            fields={
                <>
                    <FormControlLabel 
                        label={formEdit.active ? 'פעיל' : 'לא פעיל'}
                        control={
                        <Switch 
                            name="active" 
                            checked={formEdit.active || false} 
                            onChange={e => setFormEdit(old => ({...old, active: e.target.checked}))}
                        />
                    }/>
                    
                    {fields.map( field => (
                        <React.Fragment key={field.name}>
                            {field.type === 'input' ? 
                                <CustomField
                                    name={field.name}
                                    value={formEdit[field.name] || ''}
                                    label={field.label}
                                    onChange={e => handleFormHook(e.target, setFormEdit)}
                                    type={field.typeInput}
                                    disabled={!formEdit.active || false}
                                /> : field.type === 'select' ?
                                <CustomSelect 
                                    set={setFormEdit} 
                                    nameField={field.name}
                                    value={formEdit[field.name] || ''} 
                                    label={field.label}
                                    options={field.options} 
                                    optionsValue={field.optionValue}
                                /> : (
                                <>
                                    <Button 
                                        variant="contained" 
                                        sx={{width: '100%'}} 
                                        onClick={() => setShowEditPrices( old => !old)}
                                    >
                                        {field.label}
                                    </Button>
                                    {showEditPrices && field.element}
                                </>
                                )
                            }
                        </React.Fragment>
                    ))}
                </>
            }
        />
    )
}