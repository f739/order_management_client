import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getActiveOrders, removeProduct } from "../dl/slices/orders";
import { NewOrderToDeliver } from '../components/NewOrderToDeliver';
import { getProducts } from '../dl/slices/products';
import { BoxPrice } from '../components/BoxPrice';
import { SelectFactoryHook } from '../components/SelectFactoryHook';
import { getSuppliers } from '../dl/slices/suppliers';
import moment from 'moment';
import edit from '../assetes/edit.svg';
import trash_icon from '../assetes/trash_icon.svg'
import '../css/orderManagement.css';
import { SelectSuppliersHook } from '../components/SelectSuppliersHook';
import { toast } from "react-toastify";

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
    if (allActiveOrders.length === 0) {
      dispatch(getActiveOrders()) 
    }if (allProducts.length === 0) {
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
          listProducts: [...order.listProducts].sort((a, b) => a._idProduct.category.localeCompare(b._idProduct.category))
        }));
        setActiveOrdersFiltred(sortedActiveOrders);
        setFactoriesFilter(sortedActiveOrders);
      }else {
        const sortedActiveOrders = allActiveOrders.map(order => ({
          ...order,
          listProducts: [...order.listProducts]
          .filter( product => product._idProduct.factory === user.factory)
          .sort((a, b) => a._idProduct.category.localeCompare(b._idProduct.category))
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
          note={invitation.note}
          userName={invitation.userName}
          factory={invitation.factory}
          dispatch={dispatch}
          orderList={orderList}
          allActiveOrders={allActiveOrders}
          idInvitation={invitation._id}
          setOrderList={setOrderList}
          key={`${invitation._id}-${invitation.listProducts.length}`} />
      )) : <p>אין הזמנות לטיפול</p>}
    </div>
  )
}

const Invitation = props => {
  const { invitation, date, time, orderList, dispatch, idInvitation, userName,
     factory, allActiveOrders, setOrderList, note } = props;
  return (
    <div className="invitation-container">
      <div className="title">
        <span className={`factory-${factory}`}>{factory && factory.charAt(0).toUpperCase()}</span>
        <span>{userName}</span>
        <span>תאריך: {moment.unix(date).format("DD.MM.YYYY")}</span>
        <span>שעה: {time}</span>
      </div>
      {note && <div style={{color: 'red'}}>הערת הזמנה: {note}</div>}
      {invitation && invitation.filter( pr => pr._idProduct)
      .map(product => (
        <Product
          product={product._idProduct}
          temporaryQuantity={product.temporaryQuantity}
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
  const { product, orderList, dispatch, idInvitation, setOrderList, allActiveOrders, temporaryQuantity } = props;
  const isSelected = orderList.some(orderProduct => orderProduct._id === product._id);
  const { license } = useSelector(state => state.users.user);
  const [editQuantity, setEditQuantity] = useState(temporaryQuantity);
  const [showPrices, setShowPrices] = useState(false);

  const [priceToDeliver, setPriceToDeliver] = useState(null);

  useEffect(() => {
    const prices = product?.price?.map(p => ({
      _idSupplier: p._idSupplier,
      price: parseFloat(p.price)
    }));

    const cheapestPrice = prices?.length > 0 
      ? prices.reduce((min, p) => p.price < min.price ? p : min, prices[0]) 
      : null;

    setPriceToDeliver(cheapestPrice);
  }, [product]);

  const deleteProduct = e => {
    e.stopPropagation();
    if (license === 'purchasingManager') {
      dispatch(removeProduct({ _id: product._id, idInvitation }));
    }
  }

  const addToOrder = (event, newProduct, editQuantity, temporaryQuantity) => {
    if(newProduct.price.length === 0) return toast.error('הגדר מחיר תחילה');
    if (event.target === event.currentTarget) {
      setOrderList(prev => {
        const isProductExist = prev.some(product => product._id === newProduct._id);
        if (isProductExist) {
          return prev.filter(product => product._id !== newProduct._id);
        } else {
          const updatedOrderList = prev.filter(product => product._id !== newProduct._id);
          let totalQuantity = allActiveOrders.flatMap(order => order.listProducts)
            .filter(product => product._idProduct._id === newProduct._id)
            .reduce((acc, product) => acc + product.temporaryQuantity, 0);
            console.log(totalQuantity);
          if (editQuantity !== temporaryQuantity) {
            totalQuantity = editQuantity;
          }
          const ifsupplierExist = testIfSupplierExist(prev, priceToDeliver._idSupplier);
          if (!ifsupplierExist) {
            toast.error('ניסית לשים מוצרים מכמה ספקים אחרים')
            return prev
          }
          const newProductWithTotalQuantity = {
            ...newProduct, temporaryQuantity: Number(totalQuantity),
            price: priceToDeliver.price, _idSupplier: priceToDeliver._idSupplier
          };
          
          return [...updatedOrderList, newProductWithTotalQuantity];
        }

      });
    }
  };
  const testIfSupplierExist = (prev, _idSupplierNew) => {
    return prev.length === 0 || prev[0]._idSupplier === _idSupplierNew ? true : false;
  }

  const changePriceToDeliver = (e, idProduct, _idSupplier) => {
    const {value} = e.target;
    e.preventDefault()
    setPriceToDeliver({price: value, _idSupplier});
    setOrderList(prev => prev.map(product => {
      if (product._id === idProduct) {
        return { ...product, price: value, _idSupplier };
      }else {
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

  const ShowSupplierToDeliver = ({isSelected}) => {
    const findPriceBySupplierId = (prices, _idSupplier) => {
      return prices.find( pr => pr._idSupplier === _idSupplier)
    }

    const changeSupplier = _idSupplier => {
      const allPrice = findPriceBySupplierId(product.price, _idSupplier);
      allPrice ? setPriceToDeliver(allPrice) : null
    }

    return <SelectSuppliersHook set={changeSupplier} ifFunc={true} ifGet={false}
     form={priceToDeliver} allName={false} isSelected={isSelected} />
  }

  const editPrices = e => {
    e.stopPropagation();
    setShowPrices( old => !old)
  }
  
  return (
    <div  className={`show-product ${isSelected ? 'selected-style' : ''}`}>
      <div className={`product-details ${product.note ? 'show-div-note' : null}`} 
      onClick={e => addToOrder(e, product, editQuantity, temporaryQuantity)}>
        <div className='up'>
          <input type="setEditQuantitynumber" onChange={e => handleEditQuantity(Number(e.target.value), product._id) }
            value={editQuantity} />
          <span>{product.nameProduct}</span>
          <span>{product.unitOfMeasure}</span>
          <button onClick={e => deleteProduct(e)}>
            <img src={trash_icon} alt="delete" className="icon" />
          </button>
        </div>
        <div className="center">
          <label>מחיר מומלץ:</label>
          { priceToDeliver ? <>
            <ShowSupplierToDeliver isSelected={isSelected}/>
            <input value={priceToDeliver.price}
              onChange={e => changePriceToDeliver(e, product._id, priceToDeliver._idSupplier)} />
            </> : <span style={{color: 'red'}}>הגדר מחירים!</span>
          }
          <button onClick={e => editPrices(e)} >
            <img src={edit} alt="ערוך" className='icon'/>
          </button>
        </div>
        {/* {product.note &&
        <div className={product.note ? 'end': 'none'}>
              <span className='note'>{product.note}</span>
        </div>
        } */}
      </div>
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
