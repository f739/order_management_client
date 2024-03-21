import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createNewUser, getUsers, removeUser } from '../dl/slices/users';
import { handleFormHook } from "../components/HandleFormHook";
import trash_icon from '../assetes/trash_icon.png'
import '../css/users.css';

export const CreateUsers = () => {
    const  dispatch = useDispatch();
    const [formCreateUser, setFormCreateUser] = useState(
        {userName: '', password: '',email: '', license: '' });

    const createUser = async () => {
        dispatch( createNewUser(formCreateUser))
    }
    return(
        <>
            <div className="new-item">
                <h1>צור משתמש חדש</h1>
                <label htmlFor="userName">
                    שם משתמש:
                    <input type="text" name="userName" id="userName" onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="password">
                    :קוד משתמש
                    <input type="text" name="password" id="password" onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="email">
                    אימייל:
                    <input type="email" name="email" id="email" onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="license">
                    :רישיון
                    <select name="license" id=""  onChange={e => handleFormHook(e.target, setFormCreateUser)}>
                        <option >--בחר אפשרות--</option>
                        <option value="cooker">טבח</option>
                        <option value="purchasingManager">מנהל רכש</option>
                        <option value="Bookkeeping">הנהלת חשבונות</option>
                    </select>
                </label>
                <button onClick={createUser}>צור משתמש</button>
            </div>
            <ShowUsers dispatch={dispatch} />
        </>
    )
}

const ShowUsers = ({dispatch}) => {
    const allUsers = useSelector( state => state.users.allUsers);

    useEffect( () => {
        if (!allUsers) {
            dispatch( getUsers())
        }
    },[]);

    const deleteUser = _id => {
        dispatch( removeUser(_id))
    }
    return (
        <div className="show-items">
            <h1>משתמשים קיימים</h1>
            {allUsers.length > 0 && allUsers.map( user => (
                <div key={user._id} className="show-item">
                    <span>{user.userName}</span>
                    <span>{user.email}</span>
                    <span>{user.license}</span>
                    <button onClick={() => deleteUser(user._id)} className="delete-item">
                        <img src={trash_icon} alt="delete" />
                    </button>
                </div>
            ))}
        </div>
    )
}
