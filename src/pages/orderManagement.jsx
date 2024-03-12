import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getActiveOrders, removeProduct } from "../dl/slices/orders";
import { NewOrderToDeliver } from '../components/NewOrderToDeliver';
import '../css/orderManagement.css';

export const OrderManagement = () => {
    const dispatch = useDispatch();
    const allActiveOrders = useSelector( state => state.orders.allActiveOrders);
    const [activeOrdersFiltred, setActiveOrdersFiltred] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [showChosseSupplier, setShowChooseSupplier] = useState(false)
    useEffect( () => {
            dispatch( getActiveOrders())
    },[])
    useEffect( () => {
        const sortedActiveOrders = allActiveOrders.map(order => ({
            ...order,
            listProducts: [...order.listProducts].sort((a, b) => a.category.localeCompare(b.category))
        }));
        setActiveOrdersFiltred(sortedActiveOrders);
    },[allActiveOrders]);

    const addToOrder = (newProduct, editQuantity) => {
        setOrderList(prev => {
            const isProductExist = prev.some(product => product._id === newProduct._id);
            if (isProductExist) {
                return prev.filter(product => product._id !== newProduct._id);
            }else {
                const updatedOrderList = prev.filter(product => product._id !== newProduct._id);
    
                let totalQuantity = allActiveOrders.flatMap(order => order.listProducts)
                    .filter(product => product._id === newProduct._id)
                    .reduce((acc, product) => acc + product.temporaryQuantity, 0);
                if (editQuantity !== newProduct.temporaryQuantity) {
                    totalQuantity = editQuantity;
                }
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
            { activeOrdersFiltred.length > 0 && activeOrdersFiltred.map( invitation => (
                <Invitation  
                invitation={invitation.listProducts}
                date={invitation.date}
                time={invitation.time}
                dispatch={dispatch}
                addToOrder={addToOrder}
                orderList={orderList}
                idInvitation={invitation._id}
                key={invitation._id}/>
            ))}
        </div>
    )
}

const Invitation = props => {
    const { invitation, date, time, addToOrder, orderList, dispatch, idInvitation } = props;
    return (
        <div className="invitation-container">
            <div className="title">
                <span>תאריך: {date}</span>
                <span>שעה: {time}</span>
            </div>
            {invitation.map(product => ( 
                <Product 
                product={product}
                dispatch={dispatch}
                addToOrder={addToOrder}
                orderList={orderList}
                idInvitation={idInvitation}
                key={product._id} />
            ))}
        </div>
    )
}

const Product = props => {
    const { product, addToOrder, orderList, dispatch, idInvitation } = props;
    const isSelected = orderList.some(orderProduct => orderProduct._id === product._id);
    const [editQuantity, setEditQuantity] = useState( product.temporaryQuantity);
    const deleteProduct = () => {
        dispatch( removeProduct({_id: product._id, idInvitation}));
    }
    const selectedStyle = {
        border: '2px solid green', 
        padding: '5px',
        borderRadius: '10px',
    };
    return (
        <>
            <div className="show-product" style={isSelected ? selectedStyle : {}}>
                <span>{product.nameProduct}</span>
                <input type="number" onChange={e => setEditQuantity( Number(e.target.value))} 
                value={editQuantity} />
                <span>{product.unitOfMeasure}</span>
                <span>{product.note}</span>
                <button onClick={() => addToOrder(product, editQuantity)}>הוסף לשליחה</button>
                <button onClick={() => deleteProduct(product)}>מחק</button>
            </div>
        </>
    )
} 