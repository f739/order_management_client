import { useState, useEffect } from "react";
import { NewProduct } from "../components/NewProducts";
import { NewSupplier } from "../components/NewSupplier";
import $ from 'axios';
import { URL } from "../services/service";

export const OrderManagement = () => {
    const [ifCreateProdact, setIfCreateProdact] = useState(false);
    const [ifCreateSupplier, setIfCreateSupplier] = useState(false);
    const [groupedProducts, setGroupedProducts] = useState({});

    useEffect( () => {
        const getAllProductsAndSort = async () => {
            try {
                const res = await $.get(`${URL}/products/getAllProducts`);

                const groupBySupplier = res.data.allProducts.reduce((acc, product) => {
                    acc[product.supplier] = acc[product.supplier] || [];
                    acc[product.supplier].push(product);
                    return acc;
                }, {});
                setGroupedProducts(groupBySupplier);
            }catch (err) {
                console.log(err);
            }
        }; getAllProductsAndSort();
    },[])
    return(
        <>
            <h1>ניהול מלאי</h1>
            {!ifCreateProdact && <button onClick={() => setIfCreateProdact(old => !old)}>יצירת מוצר חדש</button>}
            {!ifCreateSupplier && <button onClick={() => setIfCreateSupplier(old => !old)}>יצירת ספק חדש</button>}
            {ifCreateProdact && <NewProduct /> }
            {ifCreateSupplier && <NewSupplier /> }
            {groupedProducts && Object.entries(groupedProducts).map(([supplier, products]) => (
                <SupplierProducts supplier={supplier} products={products} key={supplier}/>
            ))}
        </>
    )
}

const SupplierProducts = props => {
    const {supplier, products } = props;
    return (
        <>
            <div className="supplier-container">
                <h2 className="show-supplier">ספק: {supplier}</h2>
                {products.map(product => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </>
    )
}

const Product = ({product}) => {
    return (
        <>
            <div className="show-product">
                <p className="show-nameProduct">שם מוצר: {product.nameProduct}</p>
                <p className="show-quantity">כמות: {product.quantity}</p>
            </div>
        </>
    )
} 