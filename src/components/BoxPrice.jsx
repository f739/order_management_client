import React from 'react';
import { useEffect, useState } from 'react';
import { handleFormHook } from './HandleFormHook';
import { useGetSuppliersQuery } from '../dl/api/suppliersApi';
import { useAddPriceMutation } from '../dl/api/productsApi';

export const BoxPrice = ({ productId, setShowPrices, prices, license }) => {
    const [newPrice, setNewPrice] = useState({price: '', _idSupplier: ''});
    const [messageError, setMessageError] = useState('');
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [ addPrice, {error: errorAddPrice}] = useAddPriceMutation();
    
    const handleFormChangePrice = (target, _idSupplier) => {
      if (/^\d*\.?\d+$/.test(target.value)) {
        setNewPrice({price: target.value, _idSupplier})
      }else {
        setMessageError('הכנס מספר תקני')
      }
    }
    const handleSaveNewPrice = async () => {
      try {
        await addPrice({...newPrice, _idProduct: productId, license});
        setShowPrices(false)
      }catch (err) {
        console.log(err, errorAddPrice);
      }
    }
    const handleNameSupplier = _idSupplier => {
      if (allSuppliers) {
        const supplier = allSuppliers.find(supplier => supplier._id === _idSupplier);
        return supplier?.nameSupplier;
      }
    }
    if (isLoadingGetsuppliers) return <h1>louding...</h1>
    
    return (
      <div className="backdrop">
        <div className="box">
            <button onClick={ () => setShowPrices(false)} className='close-button' >X</button>
          <div className="price-row">
                {allSuppliers && allSuppliers.length > 0  && prices[0]._id !== 0 ? prices.map( price => (
                    <div key={price._id}>
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
            { messageError !== '' && <div className='message'>{messageError}</div> }
          </div>
      </div>
      
    );
  };
  
  const ShowNewPrices = props => {
    const { allSuppliers, prices, newPrice, setNewPrice, handleSaveNewPrice } = props;
    const [showAddPrice, setShowAddPrice] = useState(false);

    return (
      <>
        <button onClick={ () => setShowAddPrice( old => !old)} className='button-primary'>הגדרת מחיר חדש</button>
        { showAddPrice && <div className='add-price'>
            <select name="_idSupplier" className='select-input' onChange={e => handleFormHook(e.target, setNewPrice)}>
                <option value="">--בחר ספק--</option>
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