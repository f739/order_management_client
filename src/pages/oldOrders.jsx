import { useState ,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getOldOrders, returnProduct, removeProductInOldOrder } from '../dl/slices/orders';
import '../css/oldOrders.css';
import Camera from "../components/Camera";

export const OldOrders = () => {
    const dispatch = useDispatch();
    const [groupedOrders, setGroupedOrders] = useState([]);
    const allOrders = useSelector( state => state.orders.allOldOrders);

    useEffect( () => {
        dispatch( getOldOrders())
    },[]);

    useEffect(() => {
        if (allOrders.length) {
            const oldOrdersFiltered = [...allOrders].sort((a, b) => a.date.localeCompare(b.date));
            const groupBySupplier = oldOrdersFiltered.reduce((acc, order) => {
                const nameSupplier = order.supplier.nameSupplier; 
                acc[nameSupplier] = acc[nameSupplier] || [];
                acc[nameSupplier].push(order);
                return acc;
            }, {});
            setGroupedOrders(groupBySupplier);
        }else {
            setGroupedOrders([]);
        }
    }, [allOrders]);
    
    return (
        <>
            {Object.entries(groupedOrders).length > 0 && Object.entries(groupedOrders).map(([supplierName, orders]) => (
                <div key={supplierName} className="supplier-container">      
                    <h3 className="supplier-title"> ספק: {supplierName}</h3>
                    {orders.map(order => (
                        <OldVendorOrders key={`${order._id}-${order.orderList.length}`} date={order.date} time={order.time} 
                        orderList={order.orderList} supplierName={supplierName} idOrderList={order._id}/>
                    ))}
                </div>
            ))}
        </>
    );
};


const OldVendorOrders = ({ orderList, date, time, idOrderList }) => {
    const orderListSorted = [...orderList].sort((a, b) => a.category.localeCompare(b.category));
    const [orderListAfterFilter, setOrderListAfterFilter] = useState(orderListSorted);

    return (
        <div className="order-container">
            <div className="title-order">
                <h3>{date}</h3>
                <h3>{time}</h3>
            </div>
            {orderListAfterFilter.map(order => (
                <ShowOldOrder key={order._id}
                _id={order._id}
                idOrderList={idOrderList}
                setOrderListAfterFilter={setOrderListAfterFilter}
                nameProduct={order.nameProduct}
                temporaryQuantity={order.temporaryQuantity}
                unitOfMeasure={order.unitOfMeasure}
                price={order.price}
                category={order.category} />
            ))}
            <button className="received-button" >ההזמנה התקבלה</button>
            {/* <Camera /> */}
        </div>
    );
};


const ShowOldOrder = ({ _id, idOrderList, setOrderListAfterFilter, nameProduct,
     temporaryQuantity, unitOfMeasure, category, price }) => {
    const dispatch = useDispatch();
    const wasReceived = async () => {
        setOrderListAfterFilter(oldList => oldList.filter(order => order._id !== _id));
    };
    const returnToOrderManagement = async () => {
        dispatch( returnProduct({nameProduct, temporaryQuantity,
             unitOfMeasure, category, _id, idOrderList
        }))
    }
    const deleteProduct = () => {
        dispatch( removeProductInOldOrder({_id, idOrderList}));
    }
    return (
        <div className="order-item">
            <div className="order-details">
                <p className="show-nameProduct">{nameProduct}</p>
                <p className="show-quantity">{temporaryQuantity}</p>
                <p className="show-unit-of-measure">{unitOfMeasure}</p>
                <p className="show-category">{category}</p>
                <p className="show-price">{price}</p>
            </div>
            <button className="received-button" onClick={wasReceived}>המוצר התקבל</button>
            <button className="return-to-order-management-button" onClick={returnToOrderManagement}>החזרה להזמנות</button>
            <button onClick={deleteProduct} className="delete-item">מחק</button>
        </div>
    );
};
