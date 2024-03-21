import { useState } from 'react';
import { handleFormHook } from '../components/HandleFormHook';
import { toast } from "react-toastify";
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
    return (
        <div className='form-edit-detales-email form'>
            <label>
                אימייל:
                <input type="email" name="email"
                onChange={ e => handleFormHook(e.target, setEditDetalseEmail)}/>
            </label>
            <label>
                קוד בן 16 ספרות:
                <input type="text" name="code"  
                onChange={ e => handleFormHook(e.target, setEditDetalseEmail)}/>
            </label>
            <button onClick={sendForm}>שנה פרטים</button>
        </div>
    )
}