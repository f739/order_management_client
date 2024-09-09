import React, { useState, useEffect, useCallback } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import { DialogSendInvitation } from "../../components/DialogSendInvitation";
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
import { ErrorPage, LoudingPage, CustomField, CustomSelect, SelectFactoryMultipleHook, TimedAlert } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Chip, Divider, IconButton, FormControlLabel, Switch, Fab, Paper } from "@mui/material";
import { FilterRow } from "../../components/filters/FilterRow";
import { useFilters } from '../../hooks/useFilters';
import { BoxEditPrices } from "../../components/BoxEditPrices";
import { actions } from "../../dl/slices/products";
import { useDispatch, useSelector } from "react-redux";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { StyledPaper } from "../../css/styles/paper";

export const Products = () => {
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();

    const [showAddProduct, setShowAddProduct] = useState(false);

    if (errorGetCategories) return <ErrorPage error={errorGetCategories} />
    if (errorGetMeasures) return <ErrorPage error={errorGetMeasures} />
    if (isLoadingGetCategories || isLoadingGetMeasures) return <LoudingPage />;
    return (
        <Box sx={{ margin: '20px 5px'}}>
            {showAddProduct ?
                <NewProduct 
                    setShowAddProduct={setShowAddProduct} 
                    allCategories={allCategories}
                    allMeasures={allMeasures}
                /> :
                <ShowProducts 
                    allCategories={allCategories}
                    allMeasures={allMeasures}
                />
            }
            {!showAddProduct && <Fab
                color="primary"
                onClick={() => setShowAddProduct(true)}
                sx={{
                    position: 'fixed',
                    bottom: 40,
                    left: 46,
                }}
            >
                <AddIcon />
            </Fab>}
        </Box>
    )
}
const NewProduct = ({setShowAddProduct, allCategories, allMeasures}) => {
    const dispatch = useDispatch();
    const { newPrice, newProduct, errorNewPrice } = useSelector(state => state.products);
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [createNewProduct, { error, isLoading: isLoadingCreateProdact, data: dataCreateProduct }] = useCreateNewProductMutation();

    const fields = [
        { label: 'שם מוצר', type: 'input', typeInput: 'text', name: 'nameProduct' },
        { label: 'מק"ט', type: 'input', typeInput: 'text', name: 'sku' },
        {
            label: 'קטגוריה', type: 'select', name: 'category',
            options: allCategories, optionValue: 'nameCategory', optionsValueToShow: '_id'
        },
        {
            label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure',
            options: allMeasures, optionValue: 'measureName', optionsValueToShow: '_id'
        },
        // { label: 'מחירים', type: 'button', name: 'price', element: <BoxEditPrices /> },
    ];
    const handleUpdateNewPrice = (value, name) => {
        dispatch(actions.updatedPrice({ value, name }));
    }
    const handleUpdateNewPrpduct = (value, name) => {
        dispatch(actions.updatedProduct({ value, name }));
    }

    const handleSelectBranch = newBranches => {
        handleUpdateNewPrpduct(newBranches, 'branches');
    }

    const handleSaveNewPrice = () => {
        dispatch(actions.saveNewPrice());
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

    if (errorGetsuppliers) return <ErrorPage error={errorGetsuppliers} />
    if (isLoadingGetsuppliers) return <LoudingPage />;

    return (
        <Stack sx={{ p: '5px' }} spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">יצירת מוצר חדש</Typography>
                <IconButton onClick={() => setShowAddProduct(false)} >
                    <Typography variant="body2">רשימת המוצרים</Typography>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>
            {fields.map(field => (
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
                            <Chip sx={{ marginRight: '5px', p: 1 }} variant="outlined" color="success" size="small" key={price._idSupplier}
                                label={`${getDetalesSupplier(price._idSupplier)?.nameSupplier || ''} - ${price.price}`}
                                onDelete={() => handleDeletePrice(i)}
                            />
                        ))}
                        {errorNewPrice && <TimedAlert message={errorNewPrice}  />}
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
            {error && <TimedAlert message={error}  />}
            {dataCreateProduct && <TimedAlert message={dataCreateProduct} severity={'success'} /> }
            <Button onClick={handleSaveNewProduct} color="primary" variant="contained" disabled={isLoadingCreateProdact}>
                {isLoadingCreateProdact ? <CircularProgress size={24} /> : 'שמור'}
            </Button>
        </Stack>
    )
}

const ShowProducts = ({ allCategories, allMeasures }) => {
    const { data: allProducts, error: errorGetProducts, isLoading: isLoadingGetProducts } = useGetProductsQuery();
    const [showEditProduct, setShowEditProduct] = useState('');

    const filterFields = ['category', 'branch', 'unitOfMeasure', 'active'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allProducts) {
            setData(allProducts)
        }
    }, [allProducts]);

    if (errorGetProducts) return <ErrorPage error={errorGetProducts} />
    if (isLoadingGetProducts) return <LoudingPage />;
    
    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} >
            <Box>
                <Typography variant="h5" sx={{ textAlign: 'right', color: 'text.primary' }}>
                    מוצרים
                </Typography>
                {filteredData.length > 0 ? (
                    filteredData.map(product => (
                        <React.Fragment key={product._id}>
                    <StyledPaper 
                        elevation={2}
                        active={product.active.toString()}
                        onClick={() => setShowEditProduct(product)}
                    >
                        <Grid container spacing={1} justifyContent="space-between" alignItems="center">
                        <Grid item xs={7} sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            {product.nameProduct}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            {product.branch.nameBranch}
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sx={{ textAlign: 'left' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                {product.category?.nameCategory}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.unitOfMeasure?.measureName}
                            </Typography>
                        </Grid>
                        </Grid>
                    </StyledPaper>
                    <Divider />
                    {showEditProduct._id === product._id && (
                    <EditProduct
                        product={product}
                        setShowEditProduct={setShowEditProduct}
                        allCategories={allCategories}
                        allMeasures={allMeasures}
                    />
                    )}
                </React.Fragment>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    אין מוצרים להצגה
                    </Typography>
                )}
                </Box>
            </FilterRow>
        </Box>
    )
}

const EditProduct = props => {
    const { product, setShowEditProduct, allCategories, allMeasures } = props;
    const [removeProduct, { error: errorRemoveProduct, isLoading: isLoudingDelete, data }] = useRemoveProductMutation();
    const [editProduct, { error: errorEdit, isLoading: isLoadingEdit }] = useEditProductMutation();
    const [formEdit, setFormEdit] = useState({ ...product, branch: product.branch._id, category: product.category?._id, unitOfMeasure: product.unitOfMeasure?._id });
    const [showEditPrices, setShowEditPrices] = useState(false);
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();

    const fields = [
        { label: 'שם מוצר', type: 'input', typeInput: 'text', name: 'nameProduct' },
        { label: 'מק"ט', type: 'input', typeInput: 'text', name: 'sku' },
        {
            label: 'סניף', type: 'select', name: 'branch', options: allBranches,
            optionValue: 'nameBranch', optionsValueToShow: '_id'
        },
        {
            label: 'קטגוריה', type: 'select', name: 'category',
            options: allCategories, optionValue: 'nameCategory', optionsValueToShow: '_id'
        },
        {
            label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure',
            options: allMeasures, optionValue: 'measureName', optionsValueToShow: '_id'
        },
        { label: 'מחירים', type: 'button', name: 'price' },
    ];

    const handleEditItem = async productUpdated => {
        try {
            await editProduct(productUpdated).unwrap();
            setShowEditProduct('');
        } catch (err) { }
    }

    const deleteProduct = async _id => {
        try {
            await removeProduct(_id).unwrap();
            setShowEditProduct('');
        } catch (err) { }
    }
    if (errorGetBranches) return <ErrorPage error={errorGetBranches} />

    return (
        <DialogSendInvitation
            title='ערוך מוצר'
            cart={false}
            setOpenDialog={setShowEditProduct}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveProduct}
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
                                onChange={e => setFormEdit(old => ({ ...old, active: e.target.checked }))}
                            />
                        } />

                    {fields.map(field => (
                        <React.Fragment key={field.name}>
                            {field.type === 'input' ?
                                <CustomField
                                    name={field.name}
                                    initialValue={product[field.name]}
                                    value={formEdit[field.name]}                                    label={field.label}
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
                                                sx={{ width: '100%' }}
                                                onClick={() => setShowEditPrices(old => !old)}
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