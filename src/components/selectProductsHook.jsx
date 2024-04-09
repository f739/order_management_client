import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from "../dl/slices/products";
import { handleFormHook } from './HandleFormHook';

export const SelectProductsHook = ({set, form}) => {
    const dispatch = useDispatch();
    const {allProducts, isLoading} = useSelector( state => state.products);

    useEffect( () => {
        if (allProducts.length === 0) {
            dispatch( getProducts())
        }
    },[]);
    return (
        <select id="products-select" name="skuProduct" value={form.skuProduct} onChange={e => handleFormHook(e.target, set)}>
            <option value="">*--בחר מוצר--</option>
            {allProducts && allProducts.length > 0 && allProducts.map(product => (    
                <option value={product.sku} key={product._id}>{product.nameProduct}</option>
            ))}
        </select>
    )
}