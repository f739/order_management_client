import { useState } from "react";
import { useSelector } from 'react-redux';
import { handleFormHook } from './HandleFormHook';
import { SelectFactoryHook } from './SelectFactoryHook';
import { SelectCatgoryHook } from './SelectCatgoryHook';
import { SelectMeasureHook } from './SelectMeasureHook';
import { BoxPrice } from './BoxPrice';
import trash_icon from '../assetes/trash_icon.svg';

export const EditItemHook = ({ initialData, onSubmit, fields, setShowEdit, deleteItem }) => {
    const [formData, setFormData] = useState(initialData);
    const [showPrices, setShowPrices] = useState(false);
    const prices = useSelector( state => {
        const pr = state.products.allProducts.find(p => p._id === initialData._id);
        return pr?.price 
      });

    return (
        <div className="backdrop">
            <div className="box">
                <h2>טופס עריכת פריט</h2>
                <button onClick={ () => setShowEdit(false)} className='close-button' >X</button>
                <div className="price-row">
                {fields.map(field => (
                    <div key={field.name} >
                        <div className="supplier-name">{field.label}</div>
                        { field.type === 'input' ? 
                            <input
                                type={field.typeInput}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={e => handleFormHook(e.target, setFormData)}
                                className="supplier-price"
                                style={{padding: '5px', width: '95%'}}
                            /> :
                        field.type === 'price' ?
                        <>
                            { !showPrices ? <button onClick={setShowPrices} style={{padding: '5px', width: '100%'}}>הצג מחירים</button> :
                            <BoxPrice  prices={prices} setShowPrices={setShowPrices} 
                            productId={initialData._id} license='purchasingManager' /> }
                        </> :
                        field.type === 'select' && field.name === 'factory' ?  
                            <SelectFactoryHook set={setFormData} form={formData} showChosseFactory={false} /> :
                        field.type === 'select' && field.name === 'category' ? 
                            <SelectCatgoryHook set={setFormData} form={formData} /> : 
                        field.type === 'select' && field.name === 'unitOfMeasure' ?
                            <SelectMeasureHook set={setFormData} form={formData} /> :
                            null
                        }
                    </div>
                ))}
                <button onClick={() => onSubmit(formData)} className="button-primary">שמור שינויים</button>
                <button onClick={() => deleteItem(formData._id)} 
                className="button-primary" 
                style={{backgroundColor: 'red'}}>מחק פריט</button>
                </div>
            </div>
        </div>
    );
};

