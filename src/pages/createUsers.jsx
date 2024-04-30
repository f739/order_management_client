import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createNewUser, getUsers, removeUser } from '../dl/slices/users';
import { handleFormHook } from "../components/HandleFormHook";
import trash_icon from '../assetes/trash_icon.svg'
import { SelectFactoryHook } from "../components/SelectFactoryHook";

export const CreateUsers = () => {
    const  dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [formCreateUser, setFormCreateUser] = useState(
        {userName: '', password: '',email: '', license: '', factory: '' });

    const createUser = async () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(formCreateUser.email)) return setMessage('האימייל אינו תקני');
        if (Object.values(formCreateUser).every(value => value !== '')) {
            dispatch( createNewUser(formCreateUser));
            setFormCreateUser({userName: '', password: '',email: '', license: '', factory: '' });
            setMessage('')
        }else {
            return setMessage('חסר פרטים הכרחיים בטופס')
        }
    }
    return(
        <>
            <div className="new-item">
                <h1>צור משתמש חדש</h1>
                <label>שם משתמש:</label>
                    <input type="text" name="userName"
                    value={formCreateUser.userName} onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                    <label>סיסמה:</label>
                    <input type="password" name="password" 
                    value={formCreateUser.password} onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                    <label>אימייל:</label>
                    <input type="email" name="email"
                    value={formCreateUser.email} onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                    <label>רישיון:</label>
                    <select name="license" value={formCreateUser.license} onChange={e => handleFormHook(e.target, setFormCreateUser)}>
                        <option >--בחר רישיון--</option>
                        <option value="cooker">טבח</option>
                        <option value="purchasingManager">מנהל רכש</option>
                        <option value="Bookkeeping">הנהלת חשבונות</option>
                    </select>
                    <label>מפעל:</label>
                <SelectFactoryHook set={setFormCreateUser} form={formCreateUser} />
                <button onClick={createUser}>צור משתמש</button>
                <span>{message}</span>
            </div>
            <ShowUsers dispatch={dispatch} />
        </>
    )
}

const ShowUsers = ({dispatch}) => {
    const {allUsers, isLoading} = useSelector( state => state.users);

    useEffect( () => {
        if (!allUsers.length) {
            dispatch( getUsers());
        }
    },[dispatch]);

    const deleteUser = _id => {
        dispatch( removeUser(_id))
    }
    if (isLoading) return <h1>🌀 Loading...</h1>;
    return (
        <div className="show-items">
            <h1>משתמשים קיימים</h1>
            {allUsers && allUsers.length > 0 ? (
            allUsers.map(user => (
                <div key={user._id} className="show-item">
                    <span className={`factory-${user.factory}`}>{user.factory && user.factory.charAt(0).toUpperCase()}</span>
                    <span>{user.userName}</span>
                    <span>{user.email}</span>
                    <span>{user.license}</span>
                    <button onClick={() => deleteUser(user._id)} >
                        <img src={trash_icon} alt="delete" className="icon" />
                    </button>
                </div>
            ))
        ) : (
            <div>אין משתמשים להצגה</div>
        )}
        </div>
    )
}
