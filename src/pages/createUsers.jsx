import { useEffect, useState } from "react";
import { URL } from '../services/service';
import '../css/users.css';
import $ from 'axios';

export const CreateUsers = () => {
    const [formCreateUser, setFormCreateUser] = useState({userName: '', userCode: '', license: '' });
    const handleDataForm = ({target}) => {
        const {name, value} = target;
        setFormCreateUser( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    const createUser = async () => {
        try {
            const res = await $.post(`${URL}/users/createNewUser`, formCreateUser);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    return(
        <>
            <ShowUsers />
            <div className="box-create-users">
                <h1>צור משתמש חדש</h1>
                <label htmlFor="userName">
                    שם משתמש:
                    <input type="text" name="userName" id="userName" onChange={handleDataForm} />
                </label>
                <label htmlFor="userCode">
                    :קוד משתמש
                    <input type="text" name="userCode" id="userCode" onChange={handleDataForm} />
                </label>
                <label htmlFor="license">
                    :רישיון
                    <select name="license" id=""  onChange={handleDataForm}>
                        <option >--בחר אפשרות--</option>
                        <option value="cooker">טבח</option>
                        <option value="purchasingManager">מנהל רכש</option>
                    </select>
                </label>
                <button onClick={createUser}>צור משתמש</button>
            </div>
        </>
    )
}

const ShowUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const deleteUser = id => {
        try {
            const res = $.delete(`${URL}/users/${id}/deleteUser`);
            console.log(res);
        }catch (err) {
            console.log(res.response.data.error);
        }
    }
    useEffect( () => {
        const getUsers = async () => {
            try {
                const res = await $.get(`${URL}/users/getUsers`);
                setAllUsers(res.data.allUsers)
            } catch (err) {
                console.log(err.response.data.error);
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
