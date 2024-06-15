import { useEffect } from "react"
import { useGetProductsQuery } from "../dl/api/productsApi";
import { handleFormHook } from './HandleFormHook';

export const SelectProductsHook = ({set, form}) => {
    const { data: allProducts, error: errorGetProducts, isLoading: isLoadingGetProducts } = useGetProductsQuery();


    if (errorGetProducts) return <h3>ERROR: {errorGetProducts.error}</h3>
    if (isLoadingGetProducts) return 'loading...';
    return (
        <select id="products-select" name="skuProduct" value={form.skuProduct} onChange={e => handleFormHook(e.target, set)}>
            <option value="">*--בחר מוצר--</option>
            {allProducts && allProducts.length > 0 && allProducts.map(product => (    
                <option value={product.sku} key={product._id}>{product.nameProduct}</option>
            ))}
        </select>
    )
}