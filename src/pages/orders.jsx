import { useState, useEffect } from "react"; 
import { ItemsBox } from "../components/ItemsBox";
import { URL } from '../services/service';
import $ from "axios";
import '../css/orders.css'

export const Orders = () => {
    const [itemsList, setItmesList] = useState([]);
    const [newQuantity, setNewQuantity] = useState(null)
    useEffect( () => {
        const getAllProducts = async () => {
            try {
                const res = await $.get(`${URL}/products/getAllProducts`);
                console.log(res.data.allProducts);
                setItmesList(res.data.allProducts)
            }catch (err) {
                console.log(err);
            }
        }; getAllProducts();
    },[newQuantity])
    const SendAnInvitation = async () => {
        try {
            const res = await $.post(`${URL}/orders/sendAnInvitation`,{});
            console.log(res.data);
        }catch (err) {
            console.log(err.response.data.error);
        }    
    }
    return(
        <>
            <h1>דף הזמנת מוצרים</h1>
            <button onClick={SendAnInvitation}>שלח הזמנה</button>
            { itemsList && itemsList.map( item => (
                <div className="box-item"  key={item._id}>
                    <ItemsBox nameProduct={item.nameProduct} 
                    temporaryQuantity={item.temporaryQuantity} 
                    unitOfMeasure={item.unitOfMeasure}
                    category={item.category}
                    setNewQuantity={setNewQuantity} 
                    id={item._id}/>
                </div>
            ))}
        </>
    )
}