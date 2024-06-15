import { useEffect, useState } from "react";
import { handleFormHook } from "../components/HandleFormHook";
import trash_icon from '../assetes/trash_icon.svg'
import { SelectFactoryHook } from "../components/SelectFactoryHook";
import { useGetUsersQuery,
    useCreateNewUserMutation,
    useRemoveUserMutation } from '../dl/api/usersApi';

export const CreateUsers = () => {
    const [message, setMessage] = useState('');
    const [formCreateUser, setFormCreateUser] = useState(
        {userName: '', password: '',email: '', license: '', factory: '' });
        
    const [createNewUser, { error, isLoading }] = useCreateNewUserMutation();
    useEffect(() => {
        if (error) {
            setMessage(error.data?.message || 'An error occurred');
        }
    }, [error]);
    const createUser = async () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(formCreateUser.email)) return setMessage('האימייל אינו תקני');
        if (Object.values(formCreateUser).every(value => value !== '')) {
            try {
                await createNewUser(formCreateUser).unwrap();
                setFormCreateUser({userName: '', password: '',email: '', license: '', factory: '' });
                setMessage('')
            }catch (err) {return}
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
                {isLoading && <span>🌀</span>}
            </div>
            <ShowUsers />
        </>
    )
}

const ShowUsers = () => {
    const { data: allUsers, error: errorGetUsers, isLoading: isLoadingGetUsers } = useGetUsersQuery();
    const [removeUser, { error: errorRemoveUser }] = useRemoveUserMutation();
    
    const deleteUser = async _id => {
        try {
            await removeUser(_id).unwrap();
        }catch (err) {
            console.log(err, errorRemoveUser);
        }
    }
    if (isLoadingGetUsers) return <h1>🌀 Loading...</h1>;
    if (errorGetUsers) return <h1> {errorGetUsers} </h1>;
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
