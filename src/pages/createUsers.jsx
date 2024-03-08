import { useEffect, useState } from "react";
import { URL } from '../services/service';
import { toast } from "react-toastify";
import { handleFormHook } from "../components/HandleFormHook";
import '../css/users.css';
import $ from 'axios';

export const CreateUsers = () => {
    const [formCreateUser, setFormCreateUser] = useState({userName: '', userCode: '', license: '' });

    const createUser = async () => {
        try {
            const res = await $.post(`${URL}/users/createNewUser`, formCreateUser);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }
    return(
        <>
            <div className="box-create-users">
                <h1>צור משתמש חדש</h1>
                <label htmlFor="userName">
                    שם משתמש:
                    <input type="text" name="userName" id="userName" onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="userCode">
                    :קוד משתמש
                    <input type="text" name="userCode" id="userCode" onChange={e => handleFormHook(e.target, setFormCreateUser)} />
                </label>
                <label htmlFor="license">
                    :רישיון
                    <select name="license" id=""  onChange={e => handleFormHook(e.target, setFormCreateUser)}>
                        <option >--בחר אפשרות--</option>
                        <option value="cooker">טבח</option>
                        <option value="purchasingManager">מנהל רכש</option>
                    </select>
                </label>
                <button onClick={createUser}>צור משתמש</button>
            </div>
            <ShowUsers />
        </>
    )
}

const ShowUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const deleteUser = id => {
        try {
            const res = $.delete(`${URL}/users/${id}/deleteUser`);
            toast.success(res.data.message);
        }catch (err) {
            toast.error(err.response.data.message);
        }
    }
    useEffect( () => {
        const getUsers = async () => {
            try {
                const res = await $.get(`${URL}/users/getUsers`);
                setAllUsers(res.data.allUsers)
            } catch (err) {
                toast.error(err.response.data.message);
            }
        }; getUsers();
    },[])
    return (
        <div className="box-existing-users">
            <h1>משתמשים קיימים</h1>
            {allUsers && allUsers.map( user => (
                <div key={user._id} className="existing-users">
                    <span>{user.userCode}</span>
                    <span>{user.userName}</span>
                    <span>{user.license}</span>
                    <button onClick={() => deleteUser(user._id)}>מחק משתמש</button>
                </div>
            ))}
        </div>
    )
}
