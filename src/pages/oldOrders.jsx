import { useState ,useEffect } from "react";
import { URL } from "../services/service";
import $ from 'axios';


export const OldOrders = () => {
    const [groupedOrders, setGroupedOrders] = useState({});

    useEffect( () => {
        const getAllOrders = async () => {
            try {
                const res = await $.get(`${URL}/products/getOldOrders`);
                console.log(res);
                const groupBySupplier = res.data.oldOrders.reduce((acc, order) => {
                    acc[order.supplier] = acc[order.supplier] || [];
                    acc[order.supplier].push(order);
                    return acc;
                }, {});
                setGroupedOrders(groupBySupplier);
            } catch (err) {
                console.log(err);
            }
        }; getAllOrders();
    }, [])
    return (
        <>
            {groupedOrders && Object.entries(groupedOrders).map(([supplier, orders]) => (
                <OldVendorOrders key={supplier} orders={orders} supplier={supplier} />
            ))}
        </>
    )
}

const OldVendorOrders = props => {
    const {supplier, orders } = props;
    return (
        <>
            <div className="supplier-container">
                <h2 className="show-supplier-old">ספק: {supplier}</h2>
                {orders.map(order => (
                    <ShowOldOrder key={order._id} order={order} />
                ))}
            </div>
        </>
    )
}

const ShowOldOrder = ({order}) => {
    const styleIfWasReceived = {
        backgroundColor: "rgb(125, 211, 125)", 
    };
    const wasReceived = async () => {
        try {
            const res = await $.put(`${URL}/products/${order._id}/wasReceived`);
            console.log(res.data);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="show-old-order" style={order.ifWasReceived ? styleIfWasReceived: null} >
            <p className="show-nameProduct">שם מוצר: {order.nameProduct}</p>
            <p className="show-quantity">כמות: {order.quantity}</p>
            {order.ifWasReceived && <p>ההזמנה התקבלה בהצלחה</p> }
            {!order.ifWasReceived && <button onClick={wasReceived}>ההזמנה התקבלה</button>}
        </div>
    )
}