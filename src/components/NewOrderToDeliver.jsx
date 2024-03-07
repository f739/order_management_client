import { useEffect, useState } from "react";
import { URL } from "../services/service";
import { handleFormHook } from "./HandleFormHook";
import $ from 'axios';


export const NewOrderToDeliver = props => {
    const { orderList } = props;
    const [allSuppliers, setAllSuppliers] = useState([]);
    const [emailForm, setEmailForm] = useState(
        {supplier: null, titleMessage: '', messageContent: '', orderList }
    )
    useEffect( () => {
        const getSuppliers = async () => {
            try {
                const res = await $.get(`${URL}/suppliers/getAllSuppliers`);
                console.log(res);
                setAllSuppliers(res.data.allSuppliers)
            }catch (err) {
                console.log(err);
            }
        }; getSuppliers();
    },[]);

    const handleSupplierChange = (e) => {
        const supplier = allSuppliers.find(supplier => supplier._id === e.target.value);
        setEmailForm(oldForm => ({
            ...oldForm,
            supplier
        }));
    }

    const sendOrder = async () => {
        try {
            const res = await $.post(`${URL}/orderManagement/newOrderToDeliver`, emailForm);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
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