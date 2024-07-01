import React from 'react';
import { useState, useEffect } from "react";
import { NewOrderToDeliver, CustomSelect, SelectSuppliersHook,
  BoxPrice, findBestPrice} from '../components/indexComponents';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../dl/slices/orders';
import { useGetActiveOrdersQuery, useRemoveProductMutation,
  useDeleteInvtationMutation } from './../dl/api/ordersApi';
import { defineAbilitiesFor } from '../auth/abilities';
import { AccordionComponent, InputNumberPrice,
    InputNumberQuantity, IconDeleteButton, IconEditButton, StackChips } from '../components/indexComponents';
import moment from 'moment';
import { Typography, Grid, Checkbox, Divider, ListItemText } from '@mui/material';
import '../css/orderManagement.css';

export const OrderManagement = () => {
  const { data: allActiveOrders, error: errorGetActiveOrders, isLoading: isLoadingGetActiveOrders } = useGetActiveOrdersQuery();
  const { user } = useSelector(state => state.users);
  const { errorAddOrRemoveToCart } = useSelector(state => state.orders);
  const ability = defineAbilitiesFor(user);

  const [showSendEmail, setShowSendEmail] = useState(false);
  const [activeOrdersFiltered, setActiveOrdersFiltered] = useState([]);
  const [valueFactory ,setValueFactory] = useState('allFactories')

  const sortedByCategory = list => {
    return list.sort((a, b) => a._idProduct.category.localeCompare(b._idProduct.category));
  }

  useEffect(() => {
    if (allActiveOrders && allActiveOrders.length > 0) {
      let filteredOrders = [];
        filteredOrders = allActiveOrders.map(order => ({
          ...order,
          listProducts: sortedByCategory([...order.listProducts])
        }));

      if (valueFactory !== 'allFactories') {
        filteredOrders = filteredOrders.filter(order => order.factory === valueFactory)
      }

      setActiveOrdersFiltered(filteredOrders.filter(order => order.listProducts.length > 0));
    }
  }, [allActiveOrders, user.factory, valueFactory]);

  if (errorGetActiveOrders ) return <h3>ERROR{errorGetActiveOrders.error}</h3>
  if (isLoadingGetActiveOrders ) return <h1>🌀 Loading...</h1>;

  return (
    <div>
      <CustomSelect set={setValueFactory} form={valueFactory} showAllFactoryLine={true} ifFunc={true} />
      { errorAddOrRemoveToCart && <div style={{color: 'red'}}>{errorAddOrRemoveToCart}</div>}
      {!showSendEmail && <button onClick={() => setShowSendEmail(old => !old)} className='send-order'>שלח הזמנה לספק</button>}
      {showSendEmail && <NewOrderToDeliver setShowSendEmail={setShowSendEmail} />}
      {activeOrdersFiltered && activeOrdersFiltered.length > 0 ? activeOrdersFiltered.map(invitation => (
        ability.can('read', 'PendingOrders', invitation.factory) ? (
          <Invitation
            key={`${invitation._id}-${invitation.listProducts.length}`} 
            invitation={invitation}
            allActiveOrders={allActiveOrders} />
          ) : null
        )) : <p>אין הזמנות לטיפול</p>}         
    </div>
  )
}

const Invitation = ({invitation, allActiveOrders }) => {
  const { listProducts, date, time, _id, userName, factory, note } = invitation;
  const { license } = useSelector(state => state.users.user);
  const [deleteInvitation, {error: errorDeleteInvtation}] = useDeleteInvtationMutation();
  const handleDeleteInvitation = async () => {
    try {
      await deleteInvitation({idInvitation: _id, license}).unwrap();
    }catch (err) {
      console.log(err, errorDeleteInvtation);
    }
  }

  return (
  <AccordionComponent 
      summary={
        <Grid container spacing={2}  alignItems="center" justifyContent="flex-start" >
          <Grid item  xs={12} sm="auto" >
            <StackChips factory={factory} name={userName} />
          </Grid>
          <Grid item >
            <Typography>{moment.unix(date).format("DD.MM.YYYY")}</Typography>
          </Grid>
          <Grid item >
            <Typography>{time}</Typography>
          </Grid>
          <Grid item xs></Grid>
          <Grid item xs="auto" sx={{ order: { xs: 4, md: 5 } }}>
            <IconDeleteButton action={handleDeleteInvitation} />
          </Grid>
          <Grid item xs={12} md sx={{display: note ? 'block' : 'none', order: { xs: 5, md: 4 }}}>
            <Typography sx={{color: '#e57373'}}>הערת הזמנה: {note}</Typography>
          </Grid>
        </Grid>
      }
      details={
        <div >
          {listProducts && listProducts.filter( pr => pr._idProduct)
          .map(product => (
            <React.Fragment key={product._id}>
              <Divider sx={{paddingBottom: '1px'}}/>
              <Product
              product={product._idProduct}
              temporaryQuantity={product.temporaryQuantity}
              idInvitation={_id}
              allActiveOrders={allActiveOrders}
              key={product._id} />
            </React.Fragment>
          ))}
        </div>
      }
    />
  )
}

const Product = ({ product, idInvitation, temporaryQuantity }) => {
  const dispatch = useDispatch();

  const [editQuantity, setEditQuantity] = useState(temporaryQuantity);
  const [showPrices, setShowPrices] = useState(false);
  const [removeProduct, { error: errorRemoveProduct }] = useRemoveProductMutation();

  const { license } = useSelector(state => state.users.user);
  const isSelected = useSelector( state => {
    return state.orders.cartToDeliver.some(prod => prod._id === product._id)
  });

  const [priceToDeliver, setPriceToDeliver] = useState(findBestPrice(product));
  
  const deleteProduct = async e => {
    try {
      await removeProduct({ _id: product._id, idInvitation, license });
    }catch (err) { console.log(errorRemoveProduct) }
  }
  
  const addToOrder = (event, addProduct, editQuantity, temporaryQuantity, priceToDeliver) => {
    if (event.target.checked) {
      const { price, _idSupplier } = priceToDeliver;
      dispatch( actions.addToCart(
        {editQuantity, temporaryQuantity, ...addProduct, _idSupplier, price}))
    }else {
      dispatch( actions.removeFromCart(addProduct._id));
    }
  }

  const changePriceToDeliver = (e, idProduct=product._id, _idSupplier=priceToDeliver._idSupplier) => {
    const newPrice = e.target.value;
    setPriceToDeliver({price: newPrice, _idSupplier});
    dispatch( actions.changePrice({idProduct, _idSupplier, price: Number(newPrice)}))
  }
  
  const handleEditQuantity = (e, idProduct=product._id) => {
    const newQuantity = Number(e.target.value)
    setEditQuantity(newQuantity);
    dispatch( actions.editQuantity({newQuantity, idProduct}))
  }

  const changeSupplier = _idSupplier => {
    const allPrice = product.price.find( pr => pr._idSupplier === _idSupplier);
    allPrice ? setPriceToDeliver(allPrice) : null;
    console.log(allPrice);
    dispatch( actions.ifSelectedChangeSupplier(
      {price: allPrice.price, _idSupplier, _id: product._id}))
  }

  const editPrices = e => {
    setShowPrices( old => !old)
  }
   
  return (
      <div className={` ${product.note ? 'show-div-note' : null}`} >
    <Grid container spacing={1}  alignItems="center" justifyContent="flex-start">
      <Grid item xs={2} md={1}>
        <Checkbox onChange={e => addToOrder(e, product, editQuantity, temporaryQuantity, priceToDeliver)}
          checked={isSelected}  />
      </Grid>
      <Grid item xs={2} md={1.5} >
        <InputNumberQuantity value={editQuantity} setValue={handleEditQuantity}/>
      </Grid>
      <Grid item xs={6} md={4.5} >
        <ListItemText primary={product.nameProduct} secondary={product.unitOfMeasure} />
      </Grid>
      <Grid item xs={1} md={1}>
        <IconDeleteButton action={deleteProduct} title={'מחק מוצר'}/>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={1} alignItems='center' justifyContent="flex-start" >
          <Grid item>
            { priceToDeliver ? 
              <>
                <Grid container  alignItems='center' justifyContent="flex-start">
                  <Grid item>
                    <SelectSuppliersHook set={changeSupplier} ifFunc={true} ifGet={false}
                      form={priceToDeliver} allName={false} />
                  </Grid>
                  <Typography sx={{p: 1}}>-</Typography>
                  <Grid item  sx={{maxWidth: '70px'}}> 
                    <InputNumberPrice value={priceToDeliver.price}  setValue={changePriceToDeliver} />
                  </Grid>
                </Grid>
              </> : <span style={{color: 'red'}}>הגדר מחירים!</span>
            }
            </Grid>
            <Grid item >
              <IconEditButton action={editPrices} title={'ערוך מחירים'} />
            </Grid>
        </Grid>
      </Grid>
        </Grid>
        {showPrices && (
            <BoxPrice 
              prices={product.price && product.price.length !== 0 ? product.price : [{_id: 0}]}
              setShowPrices={setShowPrices}
              productId={product._id}
              license={license} />
        )}
    </div>
  )
}
