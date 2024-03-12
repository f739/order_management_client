import { useEffect, useState } from "react";
import { URL } from "../services/service";
import { handleFormHook } from "./HandleFormHook";
import { toast } from "react-toastify";
import $ from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from '../dl/slices/suppliers';
import { newOrderToDeliver } from "../dl/slices/orders";

export const NewOrderToDeliver = ({orderList}) => {
    const dispatch = useDispatch();
    const allSuppliers = useSelector( state => state.suppliers.allSuppliers);
    const [emailForm, setEmailForm] = useState(
        {supplier: null, titleMessage: '', messageContent: '', orderList }
    )
    useEffect( () => {
        if (allSuppliers.length === 0) {
            dispatch( getSuppliers())
        }
    },[])

    const handleSupplierChange = e => {
        const supplier = allSuppliers.find(supplier => supplier._id === e.target.value);
        setEmailForm(oldForm => ({
            ...oldForm,
            supplier
        }));
    }

    const sendOrder = async () => {
        dispatch( newOrderToDeliver(emailForm))
    }

    return(
        <div id="blurBackground" className="blur-background">
            <div className="box-send-email">
            <label>
                אל:
                    { allSuppliers && <select className="supplier-select" name="supplier" 
                    onChange={handleSupplierChange}>
                        <option value="">--בחר אפשרות--</option>
                        { allSuppliers.map( supplier => (
                            <option value={supplier._id} key={supplier._id}>
                                {supplier.nameSupplier} ({supplier.email})
                            </option>
                        ))}
                    </select>}
                </label>
                <label className="title-message">
                    כותרת:
                    <input type="text" name="titleMessage" 
                    onChange={e => handleFormHook(e.target, setEmailForm)} />
                </label>
                <label className="message-content">
                    תוכן:
                    <textarea type="text" name="messageContent"
                     onChange={e => handleFormHook(e.target, setEmailForm)} />
                </label>
                <button onClick={sendOrder}>שלח הזמנה</button>
            </div>
        </div>
    )
} 