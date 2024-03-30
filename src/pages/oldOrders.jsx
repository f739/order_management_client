import { useState ,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getOldOrders, returnProduct, removeProductInOldOrder, productReceivedAction } from '../dl/slices/orders';
import '../css/oldOrders.css';
import Camera from "../components/Camera";

export const OldOrders = () => {
    const dispatch = useDispatch();
    const [groupedOrders, setGroupedOrders] = useState([]);
    const allOrders = useSelector( state => state.orders.allOldOrders);
    const {license} = useSelector( state => state.users.user);

    useEffect( () => {
        dispatch( getOldOrders())
    },[]);

    useEffect(() => {
        if (allOrders.length || !allOrders) {
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
        <div className="container-orders">
            {Object.entries(groupedOrders).length > 0 && Object.entries(groupedOrders).map(([supplierName, orders]) => (
                <div key={supplierName} className="supplier-container">      
                    <h3 className="supplier-title"> ספק: {supplierName}</h3>
                    {orders.map(order => (
                        <OldVendorOrders key={`${order._id}-${order.orderList.length}`} date={order.date} time={order.time} 
                        orderList={order.orderList} license={license} supplierName={supplierName} ifWasAccepted={order.ifWasAccepted} dispatch={dispatch} 
                        supplier={supplierName} idOrderList={order._id}/>
                    ))}
                </div>
            ))}
        </div>
    );
};


const OldVendorOrders = ({ orderList, date, time, idOrderList, dispatch, ifWasAccepted, license, supplier }) => {
    const orderListSorted = [...orderList].sort((a, b) => a.category.localeCompare(b.category));
    
    return (
        <div key={idOrderList}>
            { !ifWasAccepted &&  
            <div className="order-container">
                <div className="title-order">
                    <span>מספר הזמנה: {idOrderList}</span>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
                {orderListSorted.map(order => (
                    <ShowOldOrder key={order._id}
                    _id={order._id}
                    time={time}
                    date={date}
                    supplierName={supplier}
                    order={order}
                    dispatch={dispatch}
                    idOrderList={idOrderList}
                    license={license}
                    nameProduct={order.nameProduct}
                    temporaryQuantity={order.temporaryQuantity}
                    unitOfMeasure={order.unitOfMeasure}
                    price={order.price}
                    category={order.category} />
                ))}
                {/* <Camera /> */}
            </div>
            }
        </div>
    );
};


const ShowOldOrder = ({ _id, idOrderList, nameProduct, order, time, date, supplierName,
     temporaryQuantity, unitOfMeasure, category, price, dispatch, license }) => {
    
    const [valueTemporaryQuantity, setValueTemporaryQuantity] = useState(temporaryQuantity)

    const productReceived = () => {
        if (license === 'purchasingManager') {
            dispatch(productReceivedAction({ numberOrder: idOrderList, time, date, supplierName,
                product: {...order, temporaryQuantity: valueTemporaryQuantity}}));
        }
    }
    const returnToOrderManagement = async () => {
        if (license === 'purchasingManager') {
            dispatch( returnProduct({nameProduct, temporaryQuantity,
                unitOfMeasure, category, _id, idOrderList
            }))
        }
    }
    const deleteProduct = () => {
        if (license === 'purchasingManager') {
            dispatch( removeProductInOldOrder({_id, idOrderList}));
        }
    }
    return (
        <div className="order-item">
            <div className="order-details start">
                <p className="show-nameProduct"><strong>{nameProduct}</strong></p>
                <input className="show-quantity" value={valueTemporaryQuantity}
                onChange={ e => setValueTemporaryQuantity(e.target.value)}/>
                <p className="show-unit-of-measure">{unitOfMeasure}</p>
                <p className="show-price">מחיר: {price}</p>
            </div>
            <div className="end">
                <button className="received-button" onClick={productReceived}>המוצר התקבל</button>
                <button className="return-to-order-management-button" onClick={returnToOrderManagement}>החזרה להזמנות</button>
                <button onClick={deleteProduct} className="delete-item">מחק</button>
            </div>
        </div>
    );
};
