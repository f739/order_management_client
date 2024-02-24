import { ItemsBox } from "../components/ItemsBox";
import { useState } from "react"; 

export const Orders = () => {
    const itemsList = [{id: 0, item: 'suger'},{id: 1, item: 'solt'},{id: 2, item: 'coffe'},{id: 3, item: 'oil'},{id: 4, item: 'pasta'} ];
    const [orders, setOrders] = useState({
        suger: 0,
        solt: 0,
        coffe: 0,
        oil: 0,
        pasta: 0
    })
    return(
        <>
        <h1>דף הזמנת מוצרים</h1>
            { itemsList && itemsList.map( item => (
                <div className="box-item"  key={item.id}>
                    <ItemsBox item={item.item} setOrders={setOrders} amount={orders[item.item]}/>
                </div>
            ))}
        </>
    )
}