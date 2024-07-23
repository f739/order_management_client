import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleFormHook } from '../hooks/HandleFormHook';
import { useConnectUserMutation } from '../dl/api/usersApi';
import noEntry from '../assetes/noEntry.png';
import '../css/noEntry.css';

export const NoEntry = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', email: '' });
    const { from } = location.state || { from: { pathname: "/" } };

    const [connectUser, { error, isLouding }] = useConnectUserMutation();
    const connect = async () => {
        try {
            await connectUser(form).unwrap();
            navigate(from?.pathname)
        } catch (err) { }
    }

    return (
        <div className="container-entry">
            <img src={noEntry} alt="No Entry Sign" className="image-no-entry" />
            <div className='form-entry'>
                <label className="input-label-entry">אימייל:</label>
                <input type="text" name="email" value={form.email}
                    onChange={e => handleFormHook(e.target, setForm)} className="input-entry"
                />
                <label className="input-label-entry">סיסמה:</label>
                <input type="password" name="password" value={form.password}
                    onChange={e => handleFormHook(e.target, setForm)} className="input-entry"
                />
                <button onClick={connect} className='connect'>התחבר</button>
                {error && error.data.message}
            </div>
        </div>
    );
};
