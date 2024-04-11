import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers } from '../dl/slices/suppliers';
import { addPrice } from '../dl/slices/products';
import { handleFormHook } from './HandleFormHook';
import '../css/boxPrice.css';

export const BoxPrice = ({ productId, setShowPrices, prices, license }) => {
    const dispatch = useDispatch();
    const [newPrice, setNewPrice] = useState({price: '', _idSupplier: ''});
    const { allSuppliers } = useSelector( state => state.suppliers);
    useEffect( () => {
        if (allSuppliers.length === 0) {
            dispatch( getSuppliers() )
        }
    },[]);

    const handleFormChangePrice = (target, _idSupplier) => {
      setNewPrice({price: target.value, _idSupplier})
    }
    const handleSaveNewPrice = () => {
      if (license === 'purchasingManager' && newPrice.price !== '' && newPrice._idSupplier !== '') {
        dispatch( addPrice({...newPrice, _idProduct: productId}));
        setShowPrices(false)
      }
    }
    const handleNameSupplier = _idSupplier => {
      if (allSuppliers) {
        const supplier = allSuppliers.find(supplier => supplier._id === _idSupplier);
        return supplier?.nameSupplier;
      }
    }
    return (
      <div className="backdrop">
        <div className="box">
            <button onClick={ () => setShowPrices(false)} className='close-button' >X</button>
          <div className="price-row">
                {allSuppliers && allSuppliers.length > 0 ? prices.map( (price, i) => (
                    <div key={i}>
                        <div className="supplier-name" >{handleNameSupplier(price._idSupplier)}</div>
                        <input className="supplier-price"
                        name='price' 
                        defaultValue={price.price} 
                        onChange={e => handleFormChangePrice(e.target, price._idSupplier)}/>
                    </div>
                )) : <p>אין ספקים להצגה</p>}
          </div>
            <ShowNewPrices  prices={prices} 
            allSuppliers={allSuppliers} 
            setNewPrice={setNewPrice}
            handleSaveNewPrice={handleSaveNewPrice}
            newPrice={newPrice}/>
          </div>
      </div>
      
    );
  };
  
  const ShowNewPrices = props => {
    const { allSuppliers, prices, newPrice, setNewPrice, handleSaveNewPrice } = props;
    const [showAddPrice, setShowAddPrice] = useState(false);
    console.log(prices);

    return (
      <>
        <button onClick={ () => setShowAddPrice( old => !old)} className='button-primary'>הגדרת מחיר חדש</button>
        { showAddPrice && <div className='AddPrice'>
            <select name="_idSupplier" className='select-input' onChange={e => handleFormHook(e.target, setNewPrice)}>
                <option value="">--בחר אפשרות--</option>
                {allSuppliers.length > 0 && allSuppliers ? allSuppliers.map(supplier => ( 
                  <React.Fragment key={supplier._id}>
                    {prices && !prices.some(priceInfo => priceInfo._idSupplier === supplier._id) &&
                        <option value={supplier._id} key={supplier._id}>{supplier.nameSupplier}</option>  
                    }
                  </React.Fragment>
                )): <p>אין ספקים להצגה</p> }
            </select>
            <input type="text" name="price" className="input-text" value={newPrice.price} onChange={e => handleFormHook(e.target, setNewPrice)} />
        </div>}
            <button onClick={handleSaveNewPrice} className='button-primary'>שמור מחיר</button>
      </>
    )
  }