import { useEffect, useState } from "react";
import { handleFormHook } from "../HandleFormHook";
import { CustomSelect } from "../CustomSelect";
import { roles, factories } from "../../data/roles";
import {
    useGetUsersQuery,
    useCreateNewUserMutation,
    useRemoveUserMutation
} from '../../dl/api/usersApi';
import { AppBarSystemManagement, IconDeleteButton, LoudingPage, CustomField } from "../indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, MenuItem, ListItem, TextField, ListItemText } from "@mui/material";

export const Users = () => {
    const [formCreateUser, setFormCreateUser] = useState(
        { userName: '', password: '', email: '', license: '', factory: '' });
    const [createNewUser, { error, isLoading, data }] = useCreateNewUserMutation();

    const [valueTab, setValueTab] = useState(1);
    const tabs = ['צור משתמש חדש', 'משתמשים פעילים', 'משתמשים שאינם פעילים'];   

    const createUser = async () => {
        try {
            await createNewUser(formCreateUser).unwrap();
            setFormCreateUser({ userName: '', password: '', email: '', license: '', factory: '' });
        } catch (err) { }
    }

    const changeTab = (e, newValue) => {
        setValueTab(newValue)
    }

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            position: 'relative',
            minHeight: 500,
            boxShadow: '1px 1px 4px',
            margin: '0px 5px'
        }}>
            <AppBarSystemManagement tabs={tabs} valueTab={valueTab} changeTab={changeTab} />
            {valueTab === 0 ?
                (<Stack sx={{ p: '20px' }} spacing={1}>
                    <CustomField
                        id="filled-area"
                        name="userName"
                        value={formCreateUser.userName}
                        label="שם משתמש"
                        onChange={e => handleFormHook(e.target, setFormCreateUser)}
                    />
                    <CustomField
                        id="filled-area"
                        type="password"
                        name="password"
                        value={formCreateUser.password}
                        label="סיסמה"
                        onChange={e => handleFormHook(e.target, setFormCreateUser)}
                    />
                    <CustomField
                        id="filled-area"
                        type="email"
                        name="email"
                        value={formCreateUser.email}
                        label="אמייל"
                        onChange={e => handleFormHook(e.target, setFormCreateUser)}
                    />
                    
                    <CustomSelect 
                        set={setFormCreateUser} 
                        nameField='license'
                        value={formCreateUser.license} 
                        label='תפקיד'
                        options={roles} 
                        optionsValue='name'
                    />
                    <CustomSelect 
                        set={setFormCreateUser} 
                        nameField='factory'
                        value={formCreateUser.factory} 
                        label='סניף'
                        options={factories} 
                        optionsValue='name'
                    />

                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={createUser} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) : <ShowUsers />
            }
        </Box>
    )
}

const ShowUsers = () => {
    const { data: allUsers, error: errorGetUsers, isLoading: isLoadingGetUsers } = useGetUsersQuery();
    const [removeUser, { error: errorRemoveUser }] = useRemoveUserMutation();

    const deleteUser = async _id => {
        try {
            await removeUser(_id).unwrap();
        } catch (err) { }
    }
    if (isLoadingGetUsers) return <LoudingPage />;
    if (errorGetUsers) return <h1> {errorGetUsers} </h1>;

    return (
        <Box sx={{ p: 2 }}>
            {allUsers && allUsers.length > 0 ? (
                allUsers.map(user => (
                    <div key={user._id}>
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={5} sx={{ minWidth: '100px' }}>
                                <ListItemText
                                    primary={user.userName}
                                    secondary={user.factory}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ minWidth: '100px' }}>
                                <ListItemText
                                    primary={user.email}
                                    secondary={user.license}
                                />
                            </Grid>
                            <Grid item xs={1} >
                                <IconDeleteButton
                                    action={() => deleteUser(user._id)}
                                    title={errorRemoveUser?.message ?? 'מחק'}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                    </div>
                ))) : (<Typography>אין משתמשים להצגה</Typography>)
            }
        </Box>
    )
}
