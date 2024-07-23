import React, { useState, useEffect, useCallback } from "react";
import { handleFormHook } from '../HandleFormHook';
import { DialogSendInvitation } from "../cssComponents/DialogSendInvitation";
import {
    useGetProductsQuery,
    useCreateNewProductMutation,
    useRemoveProductMutation,
    useEditProductMutation
} from '../../dl/api/productsApi';
import { useGetCategoriesQuery } from "../../dl/api/categoriesApi";
import { useGetMeasuresQuery } from "../../dl/api/measuresApi";
import { useGetSuppliersQuery } from "../../dl/api/suppliersApi";
import { useGetBranchesQuery } from "../../dl/api/branchesApi"
import { AppBarSystemManagement, LoudingPage, CustomField, CustomSelect, SelectFactoryMultipleHook } from "../indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Chip, Divider, IconButton, ListItemText, FormControlLabel, Switch } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { FilterRow } from "../cssComponents/FilterRow";
import { useFilters } from '../hooks/useFilters';
import { BoxEditPrices } from "../BoxEditPrices";
import { actions } from "../../dl/slices/products";
import { useDispatch, useSelector } from "react-redux";

export const Products = () => {
    const dispatch = useDispatch();
    const { newPrice, newProduct, errorNewPrice } = useSelector( state => state.products);
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();

    const [createNewProduct, { error, isLoading: isLoadingCreateProdact, data: dataCreateProduct }] = useCreateNewProductMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור מוצר חדש', 'מוצרים פעילים', 'מוצרים שאינם פעילים'];

    const fields = [
        { label: 'שם מוצר', type: 'input', typeInput: 'text', name: 'nameProduct' },
        { label: 'מק"ט', type: 'input', typeInput: 'text', name: 'sku' },
        { label: 'קטגוריה', type: 'select', name: 'category',
             options: allCategories, optionValue: 'nameCategory', optionsValueToShow: '_id' },
        { label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure',
             options: allMeasures, optionValue: 'measureName', optionsValueToShow: '_id' },
        // { label: 'מחירים', type: 'button', name: 'price', element: <BoxEditPrices /> },
    ];
    const handleUpdateNewPrice = (value, name) => {
        dispatch(actions.updatedPrice({value, name}));
    }
    const handleUpdateNewPrpduct = (value, name) => {
        dispatch( actions.updatedProduct({value, name}));
    }

    const handleSelectBranch = newBranches => {
        handleUpdateNewPrpduct(newBranches, 'branches');
    }

    const handleSaveNewPrice = () => {
        dispatch( actions.saveNewPrice());
    }

    const handleDeletePrice = placeDelete => {
        dispatch(actions.deletePriceFromNewProduct(placeDelete))
    };

    const handleSaveNewProduct = async () => {
        try {
            await createNewProduct().unwrap();
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
                                onChange={e => handleFormHook(e.target, handleUpdateNewPrpduct, true)}
                            /> : field.type === 'select' ?
                            <CustomSelect 
                                set={handleUpdateNewPrpduct} 
                                ifFunc={true}
                                nameField={field.name}
                                value={newProduct[field.name] || ''} 
                                label={field.label}
                                options={field.options} 
                                optionsValue={field.optionValue}
                                optionsValueToShow={field.optionsValueToShow ?? null}
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
                                <Chip sx={{marginRight: '5px', p: 1}} variant="outlined" color="success" size="small" key={price._idSupplier}
                                    label={`${getDetalesSupplier(price._idSupplier)?.nameSupplier || ''} - ${price.price}`}
                                    onDelete={() => handleDeletePrice(i)} 
                                />
                            ))}
                        </Grid>
                        <Grid item xs={6} >
                            <CustomSelect 
                                set={handleUpdateNewPrice} 
                                ifFunc={true}
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
                                onChange={e => handleUpdateNewPrice(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button color="primary" variant="contained" onClick={handleSaveNewPrice}>
                                שמור מחיר
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <SelectFactoryMultipleHook set={handleSelectBranch} form={newProduct} />

                {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                {errorNewPrice && <Typography variant="button" color="error" >{errorNewPrice}</Typography>}
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

    const filterFields = ['category', 'branch', 'unitOfMeasure'];
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
                                            secondary={product.branch.nameBranch}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={product.category?.nameCategory}
                                            secondary={product.unitOfMeasure?.measureName}
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
    const [removeProduct, { error: errorRemoveProduct, isLoading: isLoudingDelete, data }] = useRemoveProductMutation();
    const [editProduct, { error: errorEdit, isLoading: isLoadingEdit }] = useEditProductMutation();
    const [formEdit, setFormEdit] = useState({...product, branch: product.branch._id, category: product.category?._id, unitOfMeasure: product.unitOfMeasure?._id});
    const [showEditPrices, setShowEditPrices] = useState(false);
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    
    const fields = [
        { label: 'שם מוצר', type: 'input', typeInput: 'text', name: 'nameProduct' },
        { label: 'מק"ט', type: 'input', typeInput: 'text', name: 'sku' },
        { label: 'סניף', type: 'select', name: 'branch', options: allBranches,
             optionValue: 'nameBranch', optionsValueToShow: '_id' },
        { label: 'קטגוריה', type: 'select', name: 'category',
             options: allCategories, optionValue: 'nameCategory', optionsValueToShow: '_id' },
        { label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure',
             options: allMeasures, optionValue: 'measureName', optionsValueToShow: '_id' },
        { label: 'מחירים', type: 'button', name: 'price'},
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
                                    optionsValueToShow={field.optionsValueToShow ?? false}
                                /> : (
                                <>
                                    <Button 
                                        variant="contained" 
                                        sx={{width: '100%'}} 
                                        onClick={() => setShowEditPrices( old => !old)}
                                    >
                                        {field.label}
                                    </Button>
                                        {showEditPrices && 
                                            <BoxEditPrices product={product} setShowEditPrices={setShowEditPrices} />
                                        }
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