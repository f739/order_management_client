import { useState, useEffect } from "react"; 
import { ItemsBox } from "../components/ItemsBox";
import { URL } from '../services/service';
import $ from "axios";

export const Orders = () => {
    const [itemsList, setItemList] = useState([]);
    const [newQuantity, setNewQuantity] = useState(null)
    useEffect( () => {
        const getAllProducts = async () => {
            try {
                const res = await $.get(`${URL}/products/getAllProducts`);
                setItemList(res.data.allProducts)
            }catch (err) {
                console.log(err);
            }
        }; getAllProducts();
    },[newQuantity])
    const sendFormOrders = async () => {
        await $.post(`${URL}/`)
    }
    return(
        <>
            <h1>דף הזמנת מוצרים</h1>
            { itemsList && itemsList.map( item => (
                <div className="box-item"  key={item._id}>
                    <ItemsBox nameProduct={item.nameProduct} quantity={item.quantity} setNewQuantity={setNewQuantity} id={item._id}/>
                </div>
            ))}
        </>
    )
}