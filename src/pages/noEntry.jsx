import { useState } from 'react';
import { handleFormHook } from '../components/HandleFormHook';
import { useConnectUserMutation } from '../dl/api/usersApi';
import noEntry from '../assetes/noEntry.png';
import '../css/noEntry.css'; 

export const NoEntry = ({setIfLicense=console.log}) => {
    const [form, setForm] = useState({password: '', email: ''});
    const [messageError, setMessageError] = useState('');
    const [connectUser, { error }] = useConnectUserMutation();
    const connect = async () => {
        try {
            await connectUser(form).unwrap();
            setIfLicense('there license');
            if (error) {
                setMessageError(error.data.message);
            }
        } catch (err) {
            setMessageError(err.message);
        }
    }
    // const connect = async () => {
    //     try {
    //         const actionResult = await dispatch( connectUser(form) );
    //         const result = unwrapResult(actionResult);
    //         setMessageError(result)
    //     }catch (err) {
    //         setMessageError(err)
    //     }
    // };

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
                <div className='message-error'>{messageError}</div>
            </div>
        </div>
    );
};
