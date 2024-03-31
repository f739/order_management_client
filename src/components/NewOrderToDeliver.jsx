import { useEffect, useState } from "react";
import { handleFormHook } from "./HandleFormHook";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from '../dl/slices/suppliers';
import { newOrderToDeliver } from "../dl/slices/orders";
import '../css/newOrderToDeliver.css';

export const NewOrderToDeliver = ({orderList, setShowSendEmail, whichFactoryToSend}) => {
    const dispatch = useDispatch();
    const {license} = useSelector( state => state.users.user);
    const {allSuppliers} = useSelector( state => state.suppliers);
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
        if (license === 'purchasingManager') {
        dispatch( newOrderToDeliver({emailForm, whichFactoryToSend}))
        }
    }

    return(
        <div className="backdrop-email">
                <div className="titles">
                    <label>הזמנה חדשה</label>
                    <button onClick={ () => setShowSendEmail(false)} className='close-button' >X</button>
                </div>
                <div className="box-email">
                <div className="label-row">
                    <label>אל</label>
                    { allSuppliers && allSuppliers.length > 0 ? <select className="supplier-select-email" name="supplier" 
                    onChange={handleSupplierChange}>
                        <option value="">--בחר אפשרות--</option>
                        { allSuppliers.map( supplier => (
                            <option value={supplier._id} key={supplier._id}>
                                {supplier.nameSupplier} ({supplier.email})
                            </option>
                        ))  }
                    </select> : <p>אין ספקים להצגה</p> }
                </div>
                <div className="label-row">
                <label className="title-message">כותרת</label>
                    <input className="input-title-message" type="text" name="titleMessage" 
                    onChange={e => handleFormHook(e.target, setEmailForm)} />
                </div>
                <div className="label-row">
                    <textarea type="text" name="messageContent" className="textarea-message-content"
                        onChange={e => handleFormHook(e.target, setEmailForm)} />
                </div>
                <button onClick={sendOrder} className="button-send-email">שלח הזמנה</button>
            </div>
        </div>
    )
} 