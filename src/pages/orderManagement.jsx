import { useState, useEffect } from "react";
import { URL } from "../services/service";
import { toast } from "react-toastify";
import { NewOrderToDeliver } from '../components/NewOrderToDeliver';
import $ from 'axios';
import '../css/orderManagement.css';

export const OrderManagement = () => {
    const [allActiveOrders, setAllActiveOrders] = useState({});
    const [showChosseSupplier, setShowChooseSupplier] = useState(false)
    useEffect( () => {
        const getAllActiveOrders = async () => {
            try {
                const res = await $.get(`${URL}/orderManagement/getAllActiveOrders`);
                const sortedActiveOrders = res.data.allActiveOrders.map(order => ({
                    ...order,
                    listProducts: order.listProducts.sort((a, b) => a.category.localeCompare(b.category))
                }));
                setAllActiveOrders(sortedActiveOrders);
            }catch (err) {
                toast.error(err.response.data.message);
            }
        }; getAllActiveOrders();
    },[])

    const [orderList, setOrderList] = useState([]);
    const addToOrder = newProduct => {
        setOrderList(prev => {
            const isProductExist = prev.some(product => product._id === newProduct._id);
            if (isProductExist) {
                return prev.filter(product => product._id !== newProduct._id);
            }else {
                const updatedOrderList = prev.filter(product => product._id !== newProduct._id);
    
                const totalQuantity = allActiveOrders.flatMap(order => order.listProducts)
                    .filter(product => product._id === newProduct._id)
                    .reduce((acc, product) => acc + product.temporaryQuantity, 0);
    
                const newProductWithTotalQuantity = {...newProduct, temporaryQuantity: totalQuantity};
                return [...updatedOrderList, newProductWithTotalQuantity];
            }

        });
    };
    
    
    return(
        <div>
            <h1>הזמנות לטיפול</h1>
            <button onClick={() => setShowChooseSupplier(old => !old)}>שלח הזמנה לספק</button>
            {showChosseSupplier && <NewOrderToDeliver  orderList={orderList} />}
            { allActiveOrders.length > 0 && allActiveOrders.map( invitation => (
                <Invitation  
                invitation={invitation.listProducts}
                date={invitation.date}
                time={invitation.time}
                addToOrder={addToOrder}
                orderList={orderList}
                key={invitation._id}/>
            ))}
        </div>
    )
}

const Invitation = props => {
    const { invitation, date, time, addToOrder, orderList } = props;
    return (
        <div className="invitation-container">
            <div className="title">
                <span>תאריך: {date}</span>
                <span>שעה: {time}</span>
            </div>
            {invitation.map(product => ( 
                <Product 
                product={product}
                addToOrder={addToOrder}
                orderList={orderList}
                key={product._id} />
            ))}
        </div>
    )
}

const Product = props => {
    const { product, addToOrder, orderList } = props;
    const isSelected = orderList.some(orderProduct => orderProduct._id === product._id);

    const selectedStyle = {
        border: '2px solid green', 
        padding: '5px',
        borderRadius: '10px',
    };
    return (
        <>
            <div className="show-product" onClick={() => addToOrder(product)} style={isSelected ? selectedStyle : {}}>
                <span>{product.category}</span>
                <span>{product._id}</span>
                <span>{product.nameProduct}</span>
                <span>{product.temporaryQuantity}</span>
                <span>{product.unitOfMeasure}</span>
                <span>{product.note}</span>
            </div>
        </>
    )
} 