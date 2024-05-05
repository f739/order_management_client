import { useState } from 'react';
import { handleFormHook } from '../components/HandleFormHook';
import { toast } from "react-toastify";
import '../css/settings.css';
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const EmailSettings = () => {
    const [editDetalseEmail, setEditDetalseEmail] = useState({email: '', code: ''});
    const sendForm = async () => {
        if (editDetalseEmail.code && editDetalseEmail.email) {
            try {
                const res = await $.put(`${URL}/settings/email`, editDetalseEmail);
                toast.success(res.data.message);
            }catch (err) {
                toast.error(err.response.data.message);
            }
        }else {
            toast.error('חסר פרטים הכרחיים בטופס');
        }
    }
    const deleteDbOrdersReceived = async () => {
        try {
            const res = await $.put(`${URL}/settings/deleteDbOrdersReceived`);
            toast.success(res.data.message);
        }catch (err) {
            toast.error(err.response.data.message);
        }
    }
    return (
        <>
            <div className='form-edit-detales-email form'>
                <div> <strong>שנה הגדרות אימייל לשליחה:</strong></div>
                <label>אימייל:</label>
                    <input type="email" name="email"
                    onChange={ e => handleFormHook(e.target, setEditDetalseEmail)}/>
                <label>קוד בן 16 ספרות:</label>
                    <input type="text" name="code"  
                    onChange={ e => handleFormHook(e.target, setEditDetalseEmail)}/>
                <button onClick={sendForm}>שנה פרטים</button>
            </div>
            <div className='form-edit-detales-email form'>
                <div style={{color: 'red'}}>זהירות...</div>
                <button onClick={deleteDbOrdersReceived} className='delete-db'>מחק נתונים! מהזמנות שהתקבלו כבר</button>
            </div>
        </>
    )
}