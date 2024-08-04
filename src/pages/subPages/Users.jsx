import { useEffect, useState } from "react";
import { handleFormHook } from "../../hooks/HandleFormHook";
import { CustomSelect } from "../../components/CustomSelect";
import { roles } from "../../data/roles";
import {
    useGetUsersQuery,
    useCreateNewUserMutation,
    useRemoveUserMutation,
    useChangeActiveUserMutation
} from '../../dl/api/usersApi';
import { useGetBranchesQuery } from "../../dl/api/branchesApi"
import { AppBarSystemManagement, IconDeleteButton, LoudingPage, CustomField } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, ListItemText, FormControlLabel, Switch } from "@mui/material";
import { FilterRow } from "../../components/filters/FilterRow";
import { useFilters } from '../../hooks/useFilters';
import { useActiveInactiveSort } from '../../hooks/useActiveInactiveSort';

export const Users = () => {
    const [formCreateUser, setFormCreateUser] = useState(
        { userName: '', password: '', email: '', license: '', branch: '' });

    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    const [createNewUser, { error, isLoading, data }] = useCreateNewUserMutation();

    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור משתמש חדש', 'משתמשים פעילים', 'משתמשים שאינם פעילים'];

    const createUser = async () => {
        try {
            await createNewUser(formCreateUser).unwrap();
            setFormCreateUser({ userName: '', password: '', email: '', license: '', branch: '' });
        } catch (err) { }
    }

    const changeTab = (e, newValue) => {
        setSecondaryTabValue(newValue)
    }

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            position: 'relative',
            minHeight: 500,
            boxShadow: '1px 1px 4px',
            margin: '0px 5px'
        }}>
            <AppBarSystemManagement
                secondaryTabs={secondaryTabs}
                secondaryTabValue={secondaryTabValue}
                onSecondaryTabChange={changeTab}
            />
            {secondaryTabValue === 0 ?
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
                        nameField='branch'
                        value={formCreateUser.branch}
                        label='סניף'
                        options={allBranches}
                        optionsValue='nameBranch'
                        optionsValueToShow='_id'
                    />

                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={createUser} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) : <ShowUsers secondaryTabValue={secondaryTabValue} />
            }
        </Box>
    )
}

const ShowUsers = ({ secondaryTabValue }) => {
    const { data: allUsers, error: errorGetUsers, isLoading: isLoadingGetUsers } = useGetUsersQuery();
    const [removeUser, { error: errorRemoveUser }] = useRemoveUserMutation();
    const [changeActiveUser, { error: errorChangeActiveUser }] = useChangeActiveUserMutation();

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allUsers) {
            setData(allUsers)
        }
    }, [allUsers]);

    const [usersActive, usersOff] = useActiveInactiveSort(filteredData);

    const deleteUser = async _id => {
        try {
            await removeUser(_id).unwrap();
        } catch (err) { }
    }

    const handleChangeActive = async (checked, userId) => {
        try {
            await changeActiveUser({ active: checked, userId }).unwrap();
        } catch (err) { }
    }

    if (isLoadingGetUsers) return <LoudingPage />;
    if (errorGetUsers) return <h1> {errorGetUsers} </h1>;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allUsers}>
                <Box sx={{ p: 2 }}>
                    {(secondaryTabValue === 1 ? usersActive : usersOff).length > 0 ? (
                        (secondaryTabValue === 1 ? usersActive : usersOff).map(user => (
                            <div key={user._id}>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item xs={3} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={user.userName}
                                            secondary={user?.branch?.nameBranch}
                                        />
                                    </Grid>
                                    <Grid item xs={5} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={user.email}
                                            secondary={user.license}
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        {errorChangeActiveUser && '!'}
                                        <FormControlLabel
                                            label={user.active ? 'פעיל' : 'לא פעיל'}
                                            control={
                                                <Switch
                                                    name="active"
                                                    checked={user.active || false}
                                                    onChange={e => handleChangeActive(e.target.checked, user._id)}
                                                />
                                            }
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
                        ))) : <Typography>אין משתמשים להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    )
}
