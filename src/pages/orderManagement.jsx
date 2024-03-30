import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getActiveOrders, removeProduct } from "../dl/slices/orders";
import { NewOrderToDeliver } from '../components/NewOrderToDeliver';
import { getProducts } from '../dl/slices/products';
import trash_icon from '../assetes/trash_icon.png';
import edit_pencile from '../assetes/edit_pencile.png';
import plus_icon from '../assetes/plus_icon.png';
import save from '../assetes/save.png';
import { BoxPrice } from '../components/BoxPrice';
import '../css/orderManagement.css';

export const OrderManagement = () => {
  const dispatch = useDispatch();
  const { allActiveOrders } = useSelector(state => state.orders);
  const { allProducts } = useSelector(state => state.products);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [activeOrdersFiltred, setActiveOrdersFiltred] = useState([]);
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    dispatch(getActiveOrders())
    if (allProducts.length === 0) {
      dispatch(getProducts())
    }
  }, [])

  useEffect(() => {
    if (allActiveOrders) {
      const sortedActiveOrders = allActiveOrders.map(order => ({
        ...order,
        listProducts: [...order.listProducts].sort((a, b) => a.category.localeCompare(b.category))
      }));
      setActiveOrdersFiltred(sortedActiveOrders);
    }
  }, [allActiveOrders]);

  return (
    <div>
      {!showSendEmail && <button onClick={() => setShowSendEmail(old => !old)} className='send-order'>שלח הזמנה לספק</button>}
      {showSendEmail && <NewOrderToDeliver orderList={orderList} setShowSendEmail={setShowSendEmail} />}
      {activeOrdersFiltred.length > 0 ? activeOrdersFiltred.map(invitation => (
        <Invitation
          invitation={invitation.listProducts}
          date={invitation.date}
          time={invitation.time}
          dispatch={dispatch}
          orderList={orderList}
          allProducts={allProducts}
          allActiveOrders={allActiveOrders}
          idInvitation={invitation._id}
          setOrderList={setOrderList}
          key={invitation._id} />
      )) : <p>אין הזמנות לטיפול</p>}
    </div>
  )
}

const Invitation = props => {
  const { invitation, date, time, orderList, dispatch, idInvitation,
    allProducts, allActiveOrders, setOrderList } = props;
  return (
    <div className="invitation-container">
      <div className="title">
        <span>תאריך: {date}</span>
        <span>שעה: {time}</span>
      </div>
      {invitation.map(product => (
        <Product
          product={product}
          dispatch={dispatch}
          orderList={orderList}
          idInvitation={idInvitation}
          allProducts={allProducts}
          allActiveOrders={allActiveOrders}
          setOrderList={setOrderList}
          key={product._id} />
      ))}
    </div>
  )
}

const Product = props => {
  const { product, orderList, dispatch, idInvitation, allProducts, setOrderList, allActiveOrders } = props;
  const isSelected = orderList.some(orderProduct => orderProduct._id === product._id);
  const [editQuantity, setEditQuantity] = useState(product.temporaryQuantity);
  const [cheapestSupplier, setCheapestSupplier] = useState({ nameSupplier: '', price: '' });
  const [prices, setPrices] = useState([]);
  const [showPrices, setShowPrices] = useState(false);
  const { license } = useSelector(state => state.users.user);

  const deleteProduct = () => {
    if (license === 'purchasingManager') {
      dispatch(removeProduct({ _id: product._id, idInvitation }));
    }
  }

  useEffect(() => {
    let productSchema;
    if (allProducts.length > 0) {
      productSchema = allProducts.find(p => p._id === product._id);
      setPrices(productSchema.price);
    }
    if (productSchema && productSchema.price && productSchema.price.length > 0) {
      const cheapest = productSchema.price.reduce((acc, supplier) => {
        const accPrice = parseFloat(acc.price);
        const supplierPrice = parseFloat(supplier.price);
        return accPrice < supplierPrice ? acc : supplier;
      }, { nameSupplier: '', price: Infinity });
      setCheapestSupplier(cheapest);
    } else {
      setCheapestSupplier({ nameSupplier: '', price: '' });
    }
  }, [allProducts, product]);

  const addToOrder = (newProduct, editQuantity) => {
    setOrderList(prev => {
      const isProductExist = prev.some(product => product._id === newProduct._id);
      if (isProductExist) {
        return prev.filter(product => product._id !== newProduct._id);
      } else {
        const updatedOrderList = prev.filter(product => product._id !== newProduct._id);
        let totalQuantity = allActiveOrders.flatMap(order => order.listProducts)
          .filter(product => product._id === newProduct._id)
          .reduce((acc, product) => acc + product.temporaryQuantity, 0);
        if (editQuantity !== newProduct.temporaryQuantity) {
          totalQuantity = editQuantity;
        }
        const newProductWithTotalQuantity = {
          ...newProduct, temporaryQuantity: Number(totalQuantity),
          price: cheapestSupplier.price
        };
        return [...updatedOrderList, newProductWithTotalQuantity];
      }

    });
  };

  const priceToDeliver = (value, idProduct) => {
    setCheapestSupplier(old => { return { ...old, price: value } })
    setOrderList(prev => prev.map(product => {
      if (product.id === idProduct) {
        return { ...product, price: value };
      }
      return product;
    }));
  }

  return (
    <>
      <div className={`show-product ${isSelected ? 'selected-style' : ''}`}>
        <div className="product-details">
          <span className='start'>
            <input type="number" onChange={e => setEditQuantity(Number(e.target.value))}
              value={editQuantity} />
            <span>{product.nameProduct}</span>
            <span>{product.unitOfMeasure}</span>
            {product.note && <span className='note'>{product.note}</span>}
          </span>
          <div className="edit-price center">
            <label>מחיר מומלץ:</label>
            <span>{cheapestSupplier.nameSupplier}</span>
            <input defaultValue={cheapestSupplier.price}
              onChange={e => priceToDeliver(e.target.value, product._id)} />
            <button onClick={() => setShowPrices(old => !old)} className='edit-item' >ערוך מחירים</button>
          </div>
          <div className='buttons end'>
            <button onClick={() => addToOrder(product, editQuantity)}>הוסף לשליחה</button>
            <button onClick={deleteProduct} className="delete-item">מחק</button>
          </div>
        </div>
        {showPrices && (
          <div className='backdrop'>
            <div className="prices-table">
              <BoxPrice prices={prices}
                setShowPrices={setShowPrices}
                productId={product._id}
                license={license} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
