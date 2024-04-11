import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createNewProduct, removeProduct } from "../dl/slices/products";
import { handleFormHook } from './HandleFormHook';
import { SelectFactoryHook } from './SelectFactoryHook';
import { SelectSuppliersHook } from './SelectSuppliersHook'
import { getMeasures } from "../dl/slices/measures";
import { getSuppliers } from "../dl/slices/suppliers";
import { getCategories } from "../dl/slices/categories";
import trash_icon from '../assetes/trash_icon.svg'
import '../css/products.css';

export const Products = () => {
    const dispatch = useDispatch();
    const [newProduct, setNewProduct] = useState({nameProduct: '', factory: '', category: '', unitOfMeasure: '', sku: '', price: []});
    const [newPrice, setNewPrice] = useState({_idSupplier: '', price: ''});
    const {allCategories} = useSelector( state => state.categories);
    const {allSuppliers} = useSelector( state => state.suppliers);
    const {allMeasures} = useSelector( state => state.measures);
    
    useEffect( () => {
        if (allCategories.length === 0) {
            dispatch( getCategories())
        }if (allMeasures.length === 0) {
            dispatch( getMeasures())
        }
    },[dispatch])

    const handleSaveNewPrice = () => {
        if (newPrice._idSupplier === '' || newPrice.price === '') {
            return
        }
        setNewProduct(prev => {
            const supplierIndex = prev.price.findIndex(supplier => supplier._id === newPrice._idSupplier);
            let updatedPrice = [...prev.price];
            if (supplierIndex !== -1) {
                updatedPrice[supplierIndex] = {...updatedPrice[supplierIndex], price: newPrice.price};
            } else {
                updatedPrice = [...updatedPrice, newPrice];
            }
            return {
                ...prev,
                price: updatedPrice
            };
        });
        setNewPrice({_idSupplier: '', price: ''});
    }
    
    const handleSaveNewProduct = () => {
        if (newProduct.nameProduct === '' || newProduct.category === '' ||
        newProduct.unitOfMeasure === '' || newProduct.sku === '' || newProduct.factory === '' ) {
        }else {
            dispatch( createNewProduct(newProduct));
            setNewProduct({nameProduct: '', factory: '', category: '', unitOfMeasure: '', sku: '', price: []});
        }
    }
    const getDetalesSupplier = _idSupplier => {
        return  allSuppliers.find( supp => supp._id === _idSupplier);
    }
    if (!allCategories || !allMeasures || !allSuppliers) return <h1>🌀 Loading...</h1>;
    
    return (
        <div>
            <div className="new-item">
                <label>
                    שם מוצר:
                    <input type="text" name="nameProduct" value={newProduct.nameProduct} onChange={e => handleFormHook(e.target, setNewProduct)} />
                </label>
                <label>
                    מק"ט:
                    <input type="text" name="sku" value={newProduct.sku} onChange={e => handleFormHook(e.target, setNewProduct)} />
                </label>
                <label className="price-label">
                    מחיר:
                    <div className="price-input-container">
                        {newProduct.price && newProduct.price.map((price, i) => (
                            <span key={i} className="price-span">{getDetalesSupplier(price._idSupplier)?.nameSupplier || ''} - {price.price}</span>
                        ))}
                        <SelectSuppliersHook set={setNewPrice} form={newPrice} />
                        <input type="text" name="price" value={newPrice.price} onChange={e => handleFormHook(e.target, setNewPrice)} />
                        <button onClick={handleSaveNewPrice}>שמור מחיר</button>
                    </div>
                </label>
                <SelectFactoryHook  set={setNewProduct} form={newProduct} />
                <label>
                    קטגוריה:
                    { <select id="categories-select" name="category" value={newProduct.category} onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        { allCategories.length > 0 && allCategories.map( category => (
                            <option value={category.nameCategory} key={category._id}>{category.nameCategory}</option>
                        )  )}
                    </select>}
                </label>
                <label>
                    יחידות מידה:
                    { <select id="unit-of-measure-select" name="unitOfMeasure" value={newProduct.unitOfMeasure}
                    onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        {allMeasures.length > 0 && allMeasures.map( measure => (
                            <option value={measure.measureName} key={measure._id}>{measure.measureName}</option>
                        )  )}
                    </select>}
                </label>
                    <button onClick={handleSaveNewProduct}>שמור מוצר חדש</button>
            </ div>
            <ShowProducts dispatch={dispatch} />
        </div>
    )
}

const ShowProducts = props => {
    const { dispatch } = props;
    const {allProducts, isLoading} = useSelector( state => state.products);

    useEffect( () => {
        if (allProducts.length === 0) {
            dispatch( getProducts())
        }
    },[])

    const deleteProduct = (_id) => {
       dispatch( removeProduct(_id))
    }
    if (isLoading) return <h1>🌀 Loading...</h1>;

    return (
        <div className="show-items">
        <h1 className="title">מוצרים קיימים:</h1>
        {allProducts && allProducts.length > 0 ? allProducts.map( product => (
                <div className="show-item" key={product._id}>
                    <span className={`factory-${product.factory}`}>{product.factory && product.factory.charAt(0).toUpperCase()}</span>
                    <span>{product.nameProduct}</span>
                    <span>{product.unitOfMeasure}</span>
                    <span>{product.category}</span>
                    <button onClick={() => deleteProduct(product._id)} className="delete-item">
                        <img src={trash_icon} alt="delete" className="icon" />
                    </button>
                </div>
            )) :  (<div>אין מוצרים להצגה</div>)}
        </div>
    )
}