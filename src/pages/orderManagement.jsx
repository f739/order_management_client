import { useState, useEffect } from "react";
import { URL } from "../services/service";
import $ from 'axios';

export const OrderManagement = () => {
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
            <h1>הזמנות לטיפול</h1>
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
    const done = async (product) => {
        try {
            const res = await $.put(`${URL}/products/0/${product._id}/changeQuantity`);
            console.log(res);
            if (res) {
                try {
                    const resAnOldOrder = await $.post(`${URL}/products/creatingAnOldOrder`, product);
                    console.log(resAnOldOrder);
                } catch (err) {
                    console.log(err);
                }
            }
        }catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="show-product">
                <p className="show-nameProduct">שם מוצר: {product.nameProduct}</p>
                <p className="show-quantity">כמות: {product.quantity}</p>
                <button onClick={e => done(product)}>ההזמנה בוצעה</button>
            </div>
        </>
    )
} 