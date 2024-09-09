import React from 'react';
import { useState, useEffect } from "react";
import { NewOrderToDeliver, CustomSelect, findBestPrice, LoudingPage, TooltipComponent, SimpleAlert, ErrorPage } from '../components/indexComponents';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../dl/slices/orders';
import {
  useGetActiveOrdersQuery, useRemoveProductInPendingOrdersMutation,
  useDeleteInvtationMutation
} from './../dl/api/ordersApi';
import { defineAbilitiesFor } from '../auth/abilities';
import {
  AccordionComponent, InputNumberPrice,
  InputNumberQuantity, IconDeleteButton, IconEditButton, StackChips, AppBarSystemManagement
} from '../components/indexComponents';
import moment from 'moment';
import { Typography, Grid, Checkbox, Divider, ListItemText, Box, Fab, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useFilters } from '../hooks/useFilters';
import { FilterRow } from '../components/filters/FilterRow';
import { BoxEditPrices } from "../components/BoxEditPrices";
import { CustomSelectStandard } from '../components/CustomSelect';

export const OrderManagement = () => {
  const { data: allActiveOrders, error: errorGetActiveOrders, isLoading: isLoadingGetActiveOrders } = useGetActiveOrdersQuery();
  const { user } = useSelector(state => state.users);
  const { errorAddOrRemoveToCart } = useSelector(state => state.orders);
  const ability = defineAbilitiesFor(user);

  const [showSendEmail, setShowSendEmail] = useState(false);

  const filterFields = ['category', 'branch', 'unitOfMeasure'];
  const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

  const sortedByCategory = list => {
    return list.sort((a, b) => a.product.category?.nameCategory.localeCompare(b.product.category?.nameCategory));
  }

  useEffect(() => {
    if (allActiveOrders) {
      const sortedProducts = allActiveOrders.map(order => ({
        ...order, listProducts: sortedByCategory([...order.listProducts])
      }))
      console.log(sortedProducts);
      setData(sortedProducts)
    }
  }, [allActiveOrders]);

  if (errorGetActiveOrders) return <ErrorPage error={errorGetActiveOrders} />
  if (isLoadingGetActiveOrders) return <LoudingPage />;

  return (
    <>
      <Box sx={{ display: 'flex', p: 1 }}>
        <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allActiveOrders}>
          <Box sx={{ p: 1 }} >
            {filteredData && filteredData.length > 0 ? filteredData.map(invitation => (
              ability.can('read', 'PendingOrders', invitation.branch._id) ? (
                <Invitation
                  key={`${invitation._id}-${invitation.listProducts.length}`}
                  invitation={invitation}
                  filteredData={filteredData} />
              ) : null
            )) : <p>אין הזמנות לטיפול</p>}
            {!showSendEmail ?
              // <TooltipComponent title='שלח הזמנה'>
              <Fab
                color="primary"
                onClick={() => setShowSendEmail(old => !old)}
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: 76,
                }}
              >
                <SendIcon />
              </Fab>
              // </TooltipComponent>
              : <NewOrderToDeliver setShowSendEmail={setShowSendEmail} />}
            {errorAddOrRemoveToCart && <SimpleAlert message={errorAddOrRemoveToCart} />}
          </Box>
        </FilterRow>
      </Box>
    </>
  )
}

const Invitation = ({ invitation }) => {
  const { listProducts, date, time, _id, userName, branch, note } = invitation;
  const [deleteInvitation, { error: errorDeleteInvtation }] = useDeleteInvtationMutation();

  const handleDeleteInvitation = async () => {
    try {
      await deleteInvitation({ idInvitation: _id }).unwrap();
    } catch (err) { }
  }

  return (
    <AccordionComponent
      summary={
        <Grid container spacing={1} alignItems="center" justifyContent="space-between" >
          <Grid item xs={12} sm="auto" >
            <StackChips branch={branch} name={userName} />
          </Grid>
          <Grid item >
            <Typography>{moment.unix(date).format("DD.MM.YYYY")}</Typography>
          </Grid>
          <Grid item >
            <Typography>{time}</Typography>
          </Grid>
          <Grid item xs="auto" sx={{ order: { xs: 4, md: 5 } }}>
            <IconDeleteButton action={handleDeleteInvitation} />
          </Grid>
          <Grid item xs={12} md sx={{ display: note ? 'block' : 'none', order: { xs: 5, md: 4 } }}>
            <Alert severity="info" >{note}</Alert>
          </Grid>
        </Grid>
      }
      details={
        <>
          {listProducts && listProducts.filter(pr => pr.product)
            .map(product => (
              <React.Fragment key={product._id}>
                <Product
                  allProduct={product}
                  idInvitation={_id}
                />
                {/* <Divider /> */}
              </React.Fragment>
            ))}
        </>
      }
    />
  )
}

const Product = ({ allProduct, idInvitation }) => {
  const { temporaryQuantity, product } = allProduct;
  const dispatch = useDispatch();
  const [showEditPrices, setShowEditPrices] = useState(false);
  const [removeProduct, { error: errorRemoveProduct }] = useRemoveProductInPendingOrdersMutation();
  const [editQuantityToDeliver, setEditQuantityToDeliver] = useState(null);

  useEffect(() => {
    const bestPrice = findBestPrice(product);
    dispatch(actions.setPriceToDeliver({ productId: product._id, ...bestPrice }));
    dispatch(actions.setQuantityToDeliver({ productId: product._id, temporaryQuantity, idInvitation }))
  }, []);

  const isSelected = useSelector(state => {
    return state.orders.cartToDeliver.some(prod => prod._id === product._id)
  });

  const priceToDeliver = useSelector(state => {
    return state.orders.pricesToDeliver[product._id];
  });

  const quantityToDeliver = useSelector(state => {
    return state.orders.quantitiesToDeliver[`${product._id}-${idInvitation}`];
  });

  const addToOrder = (event, product, editQuantityToDeliver) => {
    if (event.target.checked) {
      dispatch(actions.addToCart(
        { ...product, editQuantityToDeliver, idInvitation }
      ))
    } else {
      dispatch(actions.removeFromCart(product._id));
    }
  }

  const changePriceToDeliver = (e, productId = product._id) => {
    const price = Number(e.target.value);
    dispatch(actions.changePrice({ productId, price }))
  }

  const changeSupplier = _idSupplier => {
    dispatch(actions.changeSupplierAction({ _idSupplier, product }));
  }

  const handleEditQuantity = (e, idProduct = product._id) => {
    const newQuantity = Number(e.target.value)
    setEditQuantityToDeliver(newQuantity);
    dispatch(actions.editQuantity({ newQuantity, idProduct }))
  }

  const deleteProduct = async e => {
    try {
      await removeProduct({ _id: product._id, idInvitation });
    } catch (err) { }
  }

  return (
    <>
  <Grid 
  container 
  spacing={1} 
  alignItems="center" 
  sx={{ 
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
    justifyContent: 'flex-start',
    pt: 1
  }}
>
  <Grid item xs={3} sm="auto" sx={{ order: { xs: 2, sm: 0 } }}>
    <Checkbox onChange={e => addToOrder(e, product, editQuantityToDeliver)} checked={isSelected} />
  </Grid>
  
  <Grid item xs={9} sm={4} sx={{ order: { xs: 0, sm: 1 }, textAlign: 'right' }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
      {product.nameProduct}
    </Typography>
    <InputNumberQuantity value={quantityToDeliver} setValue={handleEditQuantity} />
  </Grid>
  
  <Grid item xs={2} sm="auto" sx={{ order: { xs: 1, sm: 3 }, textAlign: 'left' }}>
    <IconDeleteButton action={deleteProduct} title={'מחק מוצר'} />
  </Grid>
  
  <Grid item xs={9} sm={7} sx={{ order: { xs: 3, sm: 2 } }}>
    {priceToDeliver ? (
      <Box sx={{ maxWidth: { xs: '100%', sm: '250px' } }}>
        <CustomSelectStandard
          set={changeSupplier}
          ifFunc={true}
          nameField='_idSupplier'
          value={priceToDeliver._idSupplier || ''}
          label='ספק'
          options={product.price}
          optionsValue='_idSupplier.nameSupplier'
          optionsValueToShow='_idSupplier._id'
        />
        <Box sx={{ position: 'relative', mt: 1 }}>
          <InputNumberPrice value={priceToDeliver.price} setValue={changePriceToDeliver} />
          <IconEditButton action={() => setShowEditPrices(old => !old)} title={'ערוך מחירים'} />
        </Box>
      </Box>
    ) : (
      <Alert severity='warning'>לא הוגדרו מחירים</Alert>
    )}
  </Grid>
</Grid>
      {showEditPrices &&
        <BoxEditPrices product={product} setShowEditPrices={setShowEditPrices} />
      }
    </>
  )
}