import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createNewUser, getUsers, removeUser } from '../dl/slices/users';
import { handleFormHook } from "../components/HandleFormHook";
import trash_icon from '../assetes/trash_icon.png'
import '../css/users.css';

export const CreateUsers = () => {
    const  dispatch = useDispatch();
    const [formCreateUser, setFormCreateUser] = useState(
        {userName: '', password: '',email: '', license: '', factory: '' });

    const createUser = async () => {
        if (Object.values(formCreateUser).every(value => value !== '')) {
            dispatch( createNewUser(formCreateUser));
            setFormCreateUser({userName: '', password: '',email: '', license: '', factory: '' })
        }
    }
    return(
        <>
            <div className="new-item">
                <h1>צור משתמש חדש</h1>
                <label htmlFor="userName">
                    שם משתמש:
                    <input type="text" name="userName" id="userName"
                    value={formCreateUser.userName} onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="password">
                    :קוד משתמש
                    <input type="text" name="password" id="password" 
                    value={formCreateUser.password} onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="email">
                    אימייל:
                    <input type="email" name="email" id="email" 
                    value={formCreateUser.email} onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="license">
                    :רישיון
                    <select name="license" value={formCreateUser.license} onChange={e => handleFormHook(e.target, setFormCreateUser)}>
                        <option >--בחר אפשרות--</option>
                        <option value="cooker">טבח</option>
                        <option value="purchasingManager">מנהל רכש</option>
                        <option value="Bookkeeping">הנהלת חשבונות</option>
                    </select>
                </label>
                <label htmlFor="Factory">
                    :מפעל
                    <select name="factory" value={formCreateUser.factory} onChange={e => handleFormHook(e.target, setFormCreateUser)}>
                    <option value="">--בחר אפשרות--</option>
                        <option value="catering">קייטרינג</option>
                        <option value="restaurant">מסעדה</option>
                        <option value="bakery">מאפיה</option>
                    </select>
                </label>
                <button onClick={createUser}>צור משתמש</button>
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
                    <span>{user.userName}</span>
                    <span>{user.email}</span>
                    <span>{user.license}</span>
                    <span className={`factory-${user.factory}`}>{user.factory && user.factory.charAt(0).toUpperCase()}</span>
                    <button onClick={() => deleteUser(user._id)} className="delete-item">
                        <img src={trash_icon} alt="delete" />
                    </button>
                </div>
            ))
        ) : (
            <div>אין משתמשים להצגה</div>
        )}
        </div>
    )
}
