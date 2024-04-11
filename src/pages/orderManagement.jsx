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
      <SelectFactoryHook set={filterProducts} showAllFactoryLine={true} ifFunc={true} />
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
          key={`${product._id}-${product.price.length}`} />
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
  const [cheapestSupplier, setCheapestSupplier] = useState({ _idSupplier: '', price: '' });
  const [prices, setPrices] = useState([]);
  const [showPrices, setShowPrices] = useState(false);
  
  const deleteProduct = () => {
    if (license === 'purchasingManager') {
      dispatch(removeProduct({ _id: product._id, idInvitation }));
    }
  }
    
  useEffect(() => {
    if (allProducts.length === 0) return;
    let productSchema = allProducts.find(p => p._id === product._id);
    if (productSchema && productSchema.price && productSchema.price.length > 0) {
      console.log(productSchema.price);
      setPrices(productSchema.price);
      const cheapest = productSchema.price.reduce((acc, supplier) => {
        const accPrice = parseFloat(acc.price);
        const supplierPrice = parseFloat(supplier.price);
        return accPrice < supplierPrice ? acc : supplier;
      }, { _idSupplier: '', price: Infinity });
      setCheapestSupplier(cheapest);
    } else {
      setCheapestSupplier({ _idSupplier: '', price: '' });
    }
  
  }, [allProducts.length]);

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
            price: cheapestSupplier.price
          };
          return [...updatedOrderList, newProductWithTotalQuantity];
        }

      });
    }
  };

  const priceToDeliver = (e, idProduct) => {
    const {value} = e.target;
    e.preventDefault()
    setCheapestSupplier(old => { return { ...old, price: value } })
    setOrderList(prev => prev.map(product => {
      if (product.id === idProduct) {
        return { ...product, price: value };
      }
      return product;
    }));
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
            <input type="number" onChange={e => setEditQuantity(Number(e.target.value)) }
              value={editQuantity} />
            <span>{product.nameProduct}</span>
            <span>{product.unitOfMeasure}</span>
            <button onClick={deleteProduct}>
              <img src={trash_icon} alt="delete" className="icon" />
            </button>
          </div>
          <div className="center">
            <label>מחיר מומלץ:</label>
            { cheapestSupplier.price !== '' ? <>
              <span>{handleNameSupplier(cheapestSupplier._idSupplier)}</span>
              <input defaultValue={cheapestSupplier.price}
                onChange={e => priceToDeliver(e, product._id)} />
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
