
import { useState } from 'react';
import { handleFormHook } from '../components/HandleFormHook';
import { URL } from '../services/service';
import $ from 'axios';

export const EmailSettings = () => {
    const [editDetalseEmail, setEditDetalseEmail] = useState({email: '', code: ''});
    const sendForm = async () => {
        if (editDetalseEmail.code && editDetalseEmail.email) {
            try {
                const res = await $.put(`${URL}/settings/email`, editDetalseEmail);
                console.log(res);
            }catch (err) {
                console.log(err);
            }
        }else {
            // error חסר פרטים בטופס
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