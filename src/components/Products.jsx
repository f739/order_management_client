import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createNewProduct, removeProduct } from "../dl/slices/products";
import { handleFormHook } from './HandleFormHook';
import { getMeasures } from "../dl/slices/measures";
import { getSuppliers } from "../dl/slices/suppliers";
import { getCategories } from "../dl/slices/categories";
import '../css/products.css';

export const Products = () => {
    const dispatch = useDispatch();
    const [newProduct, setNewProduct] = useState({nameProduct: '', category: '', unitOfMeasure: '', sku: '', price: []});
    const [newPrice, setNewPrice] = useState({nameSupplier: '', price: ''});
    const allProducts = useSelector( state => state.products.allProducts);
    const listCategories = useSelector( state => state.categories.allCategories);
    const allSuppliers = useSelector( state => state.suppliers.allSuppliers);
    const unitOfMeasureList = useSelector( state => state.measures.allMeasures);
    const errorMessage = useSelector( state => state.products.errorMessage);
    useEffect( () => {
        if (allProducts.length === 0) {
            dispatch( getProducts())
        }if (listCategories.length === 0) {
            dispatch( getCategories())
        }if (allSuppliers.length === 0) {
            dispatch( getSuppliers())
        }if (unitOfMeasureList.length === 0) {
            dispatch( getMeasures())
        }
    },[dispatch])

    const handleSaveNewPrice = () => {
        if (newPrice.nameSupplier === '' || newPrice.price === '') {
            return
        }
        setNewProduct(prev => {
            const supplierIndex = prev.price.findIndex(supplier => supplier.supplierName === newPrice.nameSupplier);
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
        setNewPrice({nameSupplier: '', price: ''});
    }
    
    const handleSaveNewProduct = () => {
        dispatch( createNewProduct(newProduct));
        setNewProduct({nameProduct: '', category: '', unitOfMeasure: '', sku: '', price: []});
    }
    return (
        <div>
            <div className="new-product">
                <label>
                    שם מוצר:
                    <input type="text" name="nameProduct" value={newProduct.nameProduct} onChange={e => handleFormHook(e.target, setNewProduct)} />
                </label>
                <label>
                    מק"ט:
                    <input type="text" name="sku" value={newProduct.sku} onChange={e => handleFormHook(e.target, setNewProduct)} />
                </label>
                <label>
                   מחיר:
                   {newProduct.price && newProduct.price.map( (price, i) => (
                        <span key={i} className="price-span">{price.nameSupplier} - {price.price}</span>
                   ))}
                   { <select id="suppliers-select" name="nameSupplier" onChange={e => handleFormHook(e.target, setNewPrice)}>
                        <option value="">--בחר אפשרות--</option>
                        {allSuppliers.length > 0 && allSuppliers.map( supplier => (
                            <option value={supplier.nameSupplier} key={supplier._id}>{supplier.nameSupplier}</option>
                        )  )}
                    </select>}
                    <input type="text" name="price" value={newPrice.price} onChange={e => handleFormHook(e.target, setNewPrice)} />
                    <button onClick={handleSaveNewPrice}>שמור מחיר</button>
                </label>
                <label>
                    קטגוריה:
                    { <select id="categories-select" name="category"  onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        { listCategories.map( category => (
                            <option value={category.nameCategory} key={category._id}>{category.nameCategory}</option>
                        )  )}
                    </select>}
                </label>
                <label>
                    יחידות מידה:
                    { <select id="unit-of-measure-select" name="unitOfMeasure"
                    onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        { unitOfMeasureList.map( measure => (
                            <option value={measure.measureName} key={measure._id}>{measure.measureName}</option>
                        )  )}
                    </select>}
                </label>
                    <button onClick={handleSaveNewProduct}>שמור מוצר חדש</button>
            </ div>
            { errorMessage && <h4 className="error-message">{errorMessage}</h4>}
            <div className="show-products">
                <h1 className="title">מוצרים קיימים:</h1>
                {allProducts.length > 0 && allProducts.map( product => (
                    <ShowProducts key={product._id}
                    nameProduct={product.nameProduct} 
                    unitOfMeasure={product.unitOfMeasure} 
                    category={product.category} 
                    dispatch={dispatch} 
                    _id={product._id} />
                ))}
            </div>
        </div>
    )
}

const ShowProducts = props => {
    const { nameProduct, unitOfMeasure, category, _id, dispatch } = props;
    const deleteProduct = async () => {
       dispatch( removeProduct(_id))
    }
    return (
        <div className="show-products">
            <span>{nameProduct}</span>
            <span>{unitOfMeasure}</span>
            <span>{category}</span>
            <button onClick={deleteProduct}>מחק מוצר</button>
        </div>
    )
}