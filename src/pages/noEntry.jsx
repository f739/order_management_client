import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUser } from '../dl/slices/users';
import { handleFormHook } from '../components/HandleFormHook';
import noEntry from '../assetes/noEntry.png';
import '../css/noEntry.css'; 

export const NoEntry = () => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({password: '', email: ''});

    const connect = async () => {
        const res = await dispatch( connectUser(form) );
        if (res.payload) {
            window.location.reload()
        }
    };

    return (
        <div className="container-entry">
            <img src={noEntry} alt="No Entry Sign" className="image-no-entry" />
            <div className='form-entry'>
                <label className="input-label-entry">אימייל:</label>
                    <input  type="text"  name="email" value={form.email} 
                    onChange={e => handleFormHook(e.target, setForm)} className="input-entry" 
                    />
                <label className="input-label-entry">סיסמה:</label>
                    <input type="password"  name="password" value={form.password} 
                    onChange={e => handleFormHook(e.target, setForm)} className="input-entry" 
                    />
                <button onClick={connect} className='connect'>התחבר</button>
            </div>
        </div>
    );
};
