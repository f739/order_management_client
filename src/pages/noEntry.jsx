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
            <label className="input-label-entry">
               סיסמה:
                <input  type="text"  name="password" value={form.password} 
                onChange={e => handleFormHook(e.target, setForm)} className="input-password-entry" 
                />
            </label>
            <label className="input-label-entry">
               מייל:
                <input  type="text"  name="email" value={form.email} 
                onChange={e => handleFormHook(e.target, setForm)} className="input-email-entry" 
                />
            </label>
            <button onClick={connect}>התחבר</button>
        </div>
    );
};
