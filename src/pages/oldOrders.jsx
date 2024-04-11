import { useState ,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getOldOrders, returnProduct, removeProductInOldOrder, productReceivedAction } from '../dl/slices/orders';
import  vIcon from '../assetes/vIcon.svg';
import trash_icon from '../assetes/trash_icon.svg'
import return_icon from '../assetes/return_icon.svg'
import '../css/oldOrders.css';
import Camera from "../components/Camera";
import moment from 'moment';

export const OldOrders = () => {
    const dispatch = useDispatch();
    const [groupedOrders, setGroupedOrders] = useState([]);
    const { allOldOrders } = useSelector( state => state.orders);
    const { user } = useSelector( state => state.users);

    useEffect( () => {
        dispatch( getOldOrders())
    },[]);

    useEffect(() => {
        if (allOldOrders.length || !allOldOrders) {
            let oldOrdersFiltered = [...allOldOrders];
            if (user.license !== 'purchasingManager') {
                oldOrdersFiltered = oldOrdersFiltered.filter( product => product.factory === user.factory)
            }
            oldOrdersFiltered = oldOrdersFiltered.sort((a, b) => a.date > b.date);
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
    }, [allOldOrders]);
    
    return (
        <div className="container-old-orders">
            {Object.entries(groupedOrders).length > 0 && Object.entries(groupedOrders).map(([supplierName, orders]) => (
                <div key={supplierName}>      
                    <h3 className="supplier-title"> ספק: {supplierName}</h3>
                    {orders.map(order => (
                        <OldVendorOrders key={`${order._id}-${order.orderList.length}`} date={order.date} time={order.time} 
                        orderList={order.orderList} license={user.license} ifWasAccepted={order.ifWasAccepted} dispatch={dispatch} 
                        _idSupplier={order.supplier._id} factory={order.factory} idOrderList={order._id}/>
                    ))}
                </div>
            ))}
        </div>
    );
};


const OldVendorOrders = ({ orderList, factory, date, time, idOrderList, dispatch, ifWasAccepted, license, _idSupplier }) => {
    const orderListSorted = [...orderList].sort((a, b) => a.category.localeCompare(b.category));
    
    return (
        <div key={idOrderList}>
            { !ifWasAccepted &&  
            <div className="order-container">
                <div className="title-order">
                    <span className={`factory-${factory}`}>{factory && factory.charAt(0).toUpperCase()}</span>
                    <span>{idOrderList.substring(0,8)}</span>
                    <span>{time}</span>
                    <span>{moment.unix(date).format("DD.MM.YYYY")}</span>
                </div>
                {orderListSorted.map(order => (
                    <ShowOldOrder key={`${order._id}-${order.temporaryQuantity}`}
                    _id={order._id}
                    time={time}
                    date={date}
                    factory={factory}
                    _idSupplier={_idSupplier}
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
                { <Camera /> }
            </div>
            }
        </div>
    );
};


const ShowOldOrder = ({ _id, idOrderList, nameProduct, factory, order, time, date, _idSupplier,
     temporaryQuantity, unitOfMeasure, category, price, dispatch, license }) => {
    const {user} = useSelector( state => state.users);
    const [valueTemporaryQuantity, setValueTemporaryQuantity] = useState(temporaryQuantity)

    const productReceived = () => {
        if (license === 'purchasingManager') {
            dispatch(productReceivedAction({ numberOrder: idOrderList, time, date, factory, _idSupplier,
                product: {...order, temporaryQuantity: valueTemporaryQuantity}}));
        }
    }
    const returnToOrderManagement = async () => {
        if (license === 'purchasingManager') {
            dispatch( returnProduct({nameProduct, factory, temporaryQuantity,
                unitOfMeasure, category, _id, idOrderList, userName: user.userName,
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
            <div className="order-details up">
                <input type="number" value={valueTemporaryQuantity}
                onChange={ e => setValueTemporaryQuantity(e.target.value)}/>
                <span><strong>{nameProduct}</strong></span>
                <span>{unitOfMeasure}</span>
                <span>מחיר: {price}</span>
            </div>
            <div className="end">
                <button className="received-button" onClick={productReceived}><img src={vIcon} className="icon"/> </button>
                <button onClick={returnToOrderManagement}>
                    <img src={return_icon} alt="החזר להזמנות" className="icon" />
                </button>
                <button onClick={deleteProduct}>
                    <img src={trash_icon} alt="delete" className="icon" />
                </button>
            </div>
        </div>
    );
};
