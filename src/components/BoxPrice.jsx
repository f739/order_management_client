import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers } from '../dl/slices/suppliers';
import { addPrice } from '../dl/slices/products';
import { handleFormHook } from './HandleFormHook';
import '../css/boxPrice.css';

export const BoxPrice = ({ productId, setShowPrices, prices }) => {
    const dispatch = useDispatch();
    const [newPrice, setNewPrice] = useState({price: '', nameSupplier: ''});
    const allSuppliers = useSelector( state => state.suppliers.allSuppliers);
    useEffect( () => {
        if (allSuppliers.length === 0) {
            dispatch( getSuppliers() )
        }
    },[])

    const handleFormChangePrice = (target, nameSupplier) => {
      setNewPrice({price: target.value, nameSupplier})
    }
    const handleSaveNewPrice = () => {
      dispatch( addPrice({...newPrice, _idProduct: productId}))
    }
    return (
      <div className="backdrop">
        <div className="box">
            <button onClick={ () => setShowPrices(false)}>X</button>
          <div className="price-row">
                {prices.map( (price, i) => (
                    <div key={i}>
                        <div className="supplier-name" >{price.nameSupplier}</div>
                        <input className="supplier-price"
                        name='price' 
                        defaultValue={price.price} 
                        onChange={e => handleFormChangePrice(e.target, price.nameSupplier)}/>
                    </div>
                ))}
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

    return (
      <>
        <button onClick={ () => setShowAddPrice( old => !old)}>הגדרת מחיר חדש</button>
        { showAddPrice && <div className='AddPrice'>
            <select name="nameSupplier" onChange={e => handleFormHook(e.target, setNewPrice)}>
                <option value="">--בחר אפשרות--</option>
                {allSuppliers.length > 0 && allSuppliers.map(supplier => ( 
                  <React.Fragment key={supplier._id}>
                    {!prices.some(priceInfo => priceInfo.nameSupplier === supplier.nameSupplier) &&
                        <option value={supplier.nameSupplier} key={supplier._id}>{supplier.nameSupplier}</option>
                    }
                  </React.Fragment>
                ))}
            </select>
            <input type="text" name="price" value={newPrice.price} onChange={e => handleFormHook(e.target, setNewPrice)} />
        </div>}
            <button onClick={handleSaveNewPrice}>שמור מחיר</button>
      </>
    )
  }