import { useState, useEffect } from "react";
import { URL } from "../services/service";
import { toast } from "react-toastify";
import $ from 'axios';
import '../css/products.css';
import { handleFormHook } from './HandleFormHook';

export const Products = () => {
    const [newProduct, setNewProduct] = useState({nameProduct: '', supplier: '', category: '', unitOfMeasure: '', sku: ''});
    const [listCategories, setListCategories] = useState([]);
    const [unitOfMeasureList, setUnitOfMeasureList] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect( () => {
        const getFieldsForOptions = async () => {
            try {
                const res = await $.get(`${URL}/products/getFieldsForOptions`); 
                setListCategories(res.data.allproductCategories);
                setUnitOfMeasureList(res.data.allUnitOfMeasure);
                setAllProducts(res.data.allProducts);
            } catch (err) {
                toast.error(err.response.data.message);
            }
        }; getFieldsForOptions()
    },[])

    const handleSaveNewProduct = async () => {
        try {
            console.log(newProduct);
            const res = await $.post(`${URL}/products/newProduct`, newProduct);
            toast.success(res.data.message);
        }catch (err) {
            toast.error(err.response.data.message);
        }
    }
    return (
        <div>
            <div className="new-product">
                <label>
                    שם מוצר:
                    <input type="text" name="nameProduct" onChange={e => handleFormHook(e.target, setNewProduct)} />
                </label>
                <label>
                    מק"ט:
                    <input type="text" name="sku" onChange={e => handleFormHook(e.target, setNewProduct)} />
                </label>
                <label>
                    קטגוריה:
                    { listCategories && <select id="categories-select" name="category" onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        { listCategories.map( category => (
                            <option value={category.nameCategory} key={category._id}>{category.nameCategory}</option>
                        )  )}
                    </select>}
                </label>
                <label>
                    יחידות מידה:
                    { unitOfMeasureList && <select id="unit-of-measure-select" name="unitOfMeasure" 
                    onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        { unitOfMeasureList.map( measure => (
                            <option value={measure.measureName} key={measure._id}>{measure.measureName}</option>
                        )  )}
                    </select>}
                </label>
                    <button onClick={handleSaveNewProduct}>שמור מוצר חדש</button>
            </ div>
            <div className="show-products">
                <h1 className="title">מוצרים קיימים:</h1>
                {allProducts && allProducts.map( product => (
                    <ShowProducts key={product._id}
                    nameProduct={product.nameProduct} 
                    unitOfMeasure={product.unitOfMeasure} 
                    category={product.category} 
                    id={product._id} />
                ))}
            </div>
        </div>
    )
}

const ShowProducts = props => {
    const { nameProduct, unitOfMeasure, category, id } = props;
    const deleteProduct = async () => {
        try {
            const res = await $.delete(`${URL}/products/${id}/deleteProduct`);
            toast.success(res.data.message);
        }catch (err) {
            toast.error(err.response.data.message);
        }
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