import { useEffect, useState } from "react";
import { handleFormHook } from "./HandleFormHook";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from '../dl/slices/suppliers';
import { newOrderToDeliver } from "../dl/slices/orders";
import { SelectSuppliersHook } from './SelectSuppliersHook';
import '../css/newOrderToDeliver.css';

export const NewOrderToDeliver = ({orderList, setShowSendEmail, setOrderList}) => {
    const dispatch = useDispatch();
    const {license} = useSelector( state => state.users.user);
    const {allSuppliers} = useSelector( state => state.suppliers);
    const [messageError ,setMessageError] = useState('')
    const [emailForm, setEmailForm] = useState(
        {supplier: [], titleMessage: '', messageContent: '', orderList }
    )
    useEffect( () => {
        if (allSuppliers.length === 0) {
            dispatch( getSuppliers())
        }
    },[])

    const handleSupplierChange = value => {
        const supplier = allSuppliers.find(supplier => supplier._id === value);
        setEmailForm(oldForm => ({
            ...oldForm,
            supplier
        }));
    }

    const sendOrder = async () => {
        if (emailForm.supplier.length === 0) return setMessageError('לא נבחר ספק');
        if (orderList.length === 0) return setMessageError('אין מוצרים לשליחה');
        if (license === 'purchasingManager') {
            const firstFactory = orderList[0].factory;
            const ifSameFactories = orderList.every(product => product.factory === firstFactory);
            if (ifSameFactories) {
                dispatch( newOrderToDeliver({emailForm, whichFactoryToSend: firstFactory}));
                setShowSendEmail(false);
                setOrderList([])
                setMessageError('')
            }else {
                setMessageError('אין לשלוח כמה הזמנות למפעלים שונים')
            } 
        }else {
            setMessageError('אין לך רישיון מתאים')
        }
    }

    return(
        <div className="backdrop-email">
            <div className="titles">
                <label>הזמנה חדשה</label>
                { messageError !== '' && < label style={{color: 'red'}}>{messageError}</label>}
                <button onClick={ () => setShowSendEmail(false)} className='close-button' >X</button>
            </div>
            <div className="box-email">
                <div className="label-row">
                    <label>אל</label>
                    <SelectSuppliersHook set={handleSupplierChange} form={emailForm} ifFunc={true}/>
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