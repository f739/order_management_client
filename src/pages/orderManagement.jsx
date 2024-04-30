import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getActiveOrders, removeProduct } from "../dl/slices/orders";
import { NewOrderToDeliver } from '../components/NewOrderToDeliver';
import { getProducts } from '../dl/slices/products';
import edit from '../assetes/edit.svg';
import trash_icon from '../assetes/trash_icon.svg'
import { BoxPrice } from '../components/BoxPrice';
import '../css/orderManagement.css';
import { SelectFactoryHook } from '../components/SelectFactoryHook';
import moment from 'moment';
import { getSuppliers } from '../dl/slices/suppliers';

export const OrderManagement = () => {
  const dispatch = useDispatch();
  const { allActiveOrders } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.users);
  const { allSuppliers } = useSelector(state => state.suppliers);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [activeOrdersFiltred, setActiveOrdersFiltred] = useState([]);
  const [factoriesFilter, setFactoriesFilter] = useState([])
  const [orderList, setOrderList] = useState([]);
  const { allProducts, isLoading } = useSelector(state => state.products);
  const [valueFactory ,setValueFactory] = useState({factory: ''})
  useEffect(() => {
      dispatch(getActiveOrders()) 
      if (allProducts.length === 0) {
        dispatch(getProducts());
      }if (allSuppliers.length === 0) {
        dispatch( getSuppliers());
      }
  }, [])

  useEffect(() => {
    if (allActiveOrders) {
      if (user.license === 'purchasingManager') {
        const sortedActiveOrders = allActiveOrders.map(order => ({
          ...order,
          listProducts: [...order.listProducts].sort((a, b) => a.category.localeCompare(b.category))
        }));
        setActiveOrdersFiltred(sortedActiveOrders);
        setFactoriesFilter(sortedActiveOrders);
      }else {
        const sortedActiveOrders = allActiveOrders.map(order => ({
          ...order,
          listProducts: [...order.listProducts]
          .filter( product => product.factory === user.factory)
          .sort((a, b) => a.category.localeCompare(b.category))
        }));
        const filteredOrdersWithProducts = sortedActiveOrders
        .filter(order => order.listProducts.length > 0);

        setActiveOrdersFiltred(filteredOrdersWithProducts);
        setFactoriesFilter(filteredOrdersWithProducts);
      }
    }
  }, [allActiveOrders]);

  const filterProducts = value => {
    setValueFactory(value);
    setFactoriesFilter( () => {
      if (value === 'allFactories') {
        return activeOrdersFiltred;
      } else {
        return activeOrdersFiltred.filter( product => product.factory === value);
      }
    });
  }

  if (isLoading) return <h1>🌀 Loading...</h1>;

  return (
    <div>
      <SelectFactoryHook set={filterProducts} form={valueFactory} showAllFactoryLine={true} ifFunc={true} />
      {!showSendEmail && <button onClick={() => setShowSendEmail(old => !old)} className='send-order'>שלח הזמנה לספק</button>}
      {showSendEmail && <NewOrderToDeliver orderList={orderList} setOrderList={setOrderList} setShowSendEmail={setShowSendEmail} />}
      {factoriesFilter.length > 0 ? factoriesFilter.map(invitation => (
        <Invitation
          invitation={invitation.listProducts}
          date={invitation.date}
          time={invitation.time}
          userName={invitation.userName}
          factory={invitation.factory}
          dispatch={dispatch}
          orderList={orderList}
          allActiveOrders={allActiveOrders}
          idInvitation={invitation._id}
          setOrderList={setOrderList}
          key={invitation._id} />
      )) : <p>אין הזמנות לטיפול</p>}
    </div>
  )
}

const Invitation = props => {
  const { invitation, date, time, orderList, dispatch, idInvitation, userName, factory, allActiveOrders, setOrderList } = props;
  return (
    <div className="invitation-container">
      <div className="title">
        <span className={`factory-${factory}`}>{factory && factory.charAt(0).toUpperCase()}</span>
        <span>{userName}</span>
        <span>תאריך: {moment.unix(date).format("DD.MM.YYYY")}</span>
        <span>שעה: {time}</span>
      </div>
      {invitation.map(product => (
        <Product
          product={product}
          orderList={orderList}
          idInvitation={idInvitation}
          allActiveOrders={allActiveOrders}
          dispatch={dispatch}
          setOrderList={setOrderList}
          key={product._id} />
      ))}
    </div>
  )
}

const Product = props => {
  const { product, orderList, dispatch, idInvitation, setOrderList, allActiveOrders } = props;
  const isSelected = orderList.some(orderProduct => orderProduct._id === product._id);
  const { allProducts, isLoading } = useSelector(state => state.products);
  const { allSuppliers } = useSelector(state => state.suppliers);
  const { license } = useSelector(state => state.users.user);
  const [editQuantity, setEditQuantity] = useState(product.temporaryQuantity);
  const [showPrices, setShowPrices] = useState(false);
  const prices = useSelector( state => {
    const pr = state.products.allProducts.find(p => p._id === product._id);
    return pr?.price 
  });
  const cheapestPrice = useSelector(state => {
    const pr = state.products.allProducts.find(p => p._id === product._id);
    return pr ? ([...pr.price].sort((a, b) => a.price - b.price)[0] || 'No price available') : 'Product not found';
  });
  const [priceToDeliver, setPriceToDeliver] = useState(cheapestPrice.price);

  useEffect(() => {
    setPriceToDeliver(cheapestPrice?.price);
  }, [cheapestPrice]);

  const deleteProduct = () => {
    if (license === 'purchasingManager') {
      dispatch(removeProduct({ _id: product._id, idInvitation }));
    }
  }

  const addToOrder = (event, newProduct, editQuantity) => {
    if (event.target === event.currentTarget) {
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
            price: priceToDeliver
          };
          return [...updatedOrderList, newProductWithTotalQuantity];
        }

      });
    }
  };

  const changePriceToDeliver = (e, idProduct) => {
    const {value} = e.target;
    e.preventDefault()
    setPriceToDeliver(value);
    setOrderList(prev => prev.map(product => {
      if (product.id === idProduct) {
        return { ...product, price: value };
      }
      return product;
    }));
  }
  
  const handleEditQuantity = (value, idProduct) => {
    setEditQuantity(value);
    setOrderList( prev => prev.map( product => {
      if (product._id === idProduct) {
        return { ...product, temporaryQuantity: value}
      }
      return product;
    }))
  }

  const handleNameSupplier = _idSupplier => {
    if (allSuppliers) {
      const supplier = allSuppliers.find(supplier => supplier._id === _idSupplier);
      return supplier?.nameSupplier;
    }
  }
  if (isLoading) return <h1>🌀 Loading...</h1>;
  
  return (
    <div>
     { allProducts.length > 0 ? <div  className={`show-product ${isSelected ? 'selected-style' : ''}`}>
        <div className={`product-details ${product.note ? 'show-div-note' : null}`} onClick={e => addToOrder(e, product, editQuantity)}>
          <div className='up'>
            <input type="setEditQuantitynumber" onChange={e => handleEditQuantity(Number(e.target.value), product._id) }
              value={editQuantity} />
            <span>{product.nameProduct}</span>
            <span>{product.unitOfMeasure}</span>
            <button onClick={deleteProduct}>
              <img src={trash_icon} alt="delete" className="icon" />
            </button>
          </div>
          <div className="center">
            <label>מחיר מומלץ:</label>
            { cheapestPrice.price !== '' ? <>
              <span>{handleNameSupplier(cheapestPrice._idSupplier)}</span>
              <input  value={priceToDeliver}
                onChange={e => changePriceToDeliver(e, product._id)} />
              </> : <span style={{color: 'red'}}>הגדר מחירים!</span>
            }
            <button onClick={() => setShowPrices(old => !old)} >
              <img src={edit} alt="ערוך" className='icon'/>
            </button>
          </div>
          {product.note &&
          <div className={product.note ? 'end': 'none'}>
               <span className='note'>{product.note}</span>
          </div>
          }
        </div>
        {showPrices && (
          <div className='backdrop'>
            <div className="prices-table">
              <BoxPrice 
                prices={prices}
                setShowPrices={setShowPrices}
                productId={product._id}
                license={license} />
            </div>
          </div>
        )}
      </div> : <p></p>}
    </div> 
  )
}
