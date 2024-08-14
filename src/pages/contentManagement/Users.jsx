import React, { useEffect, useState } from "react";
import { handleFormHook } from "../../hooks/HandleFormHook";
import { roles } from "../../data/roles";
import {
    useGetUsersQuery,
    useCreateNewUserMutation,
    useRemoveUserMutation,
    useEditUserMutation
} from '../../dl/api/usersApi';
import { useGetBranchesQuery } from "../../dl/api/branchesApi"
import { AppBarSystemManagement, LoudingPage, CustomField } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, ListItemText, FormControlLabel, Switch, IconButton } from "@mui/material";
import { FilterRow } from "../../components/filters/FilterRow";
import { useFilters } from '../../hooks/useFilters';
import { useActiveInactiveSort } from '../../hooks/useActiveInactiveSort';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { ErrorPage, DialogSendInvitation, CustomSelect } from "../../components/indexComponents";

export const Users = () => {
    const [formCreateUser, setFormCreateUser] = useState(
        { userName: '', email: '', role: '', branch: '' });

    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    const [createNewUser, { error, isLoading, data }] = useCreateNewUserMutation();
    
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור משתמש חדש', 'משתמשים פעילים', 'משתמשים שאינם פעילים'];
    
    const createUser = async () => {
        try {
            await createNewUser(formCreateUser).unwrap();
            setFormCreateUser({ userName: '', password: '', email: '', role: '', branch: '' });
        } catch (err) { }
    }
    
    const changeTab = (e, newValue) => {
        setSecondaryTabValue(newValue)
    }

    if (errorGetBranches) return <ErrorPage error={errorGetBranches} />
    if (isLoadingGetBranches) return <LoudingPage />

    const fields = [
        { name: 'userName', label: 'שם משתמש', typeInput: 'text', type: 'input' },
        { name: 'email', label: 'אמייל', typeInput: 'email', type: 'input' },
        { name: 'role', label: 'תפקיד', type: 'select', options: roles, optionsValue: 'name' },
        { name: 'branch', label: 'סניף', type: 'select', options: allBranches, optionsValue: 'nameBranch' ,optionsValueToShow: '_id' },
    ];
    
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
                    { fields.map( filed => (
                        <React.Fragment key={filed.name}>
                            {filed.type === 'input' ?
                            <CustomField 
                                name={filed.name}
                                type={filed.type}
                                value={formCreateUser[filed.name]}
                                label={filed.label}
                                onChange={e => handleFormHook(e.target, setFormCreateUser)}
                            /> :
                            <CustomSelect 
                                set={setFormCreateUser}
                                nameField={filed.name}
                                value={formCreateUser[filed.name] || ''}
                                label={filed.label}
                                options={filed.options}
                                optionsValue={filed.optionsValue}
                                optionsValueToShow={filed.optionsValueToShow ?? null}
                            />}
                        </React.Fragment>
                    )) }
                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={createUser} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) : <ShowUsers secondaryTabValue={secondaryTabValue} allBranches={allBranches} />
            }
        </Box>
    )
}

const ShowUsers = ({ secondaryTabValue, allBranches }) => {
    const { data: allUsers, error: errorGetUsers, isLoading: isLoadingGetUsers } = useGetUsersQuery();
    const [showEditUser, setShowEditUser] = useState(false);

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allUsers) {
            setData(allUsers)
        }
    }, [allUsers]);

    const [usersActive, usersOff] = useActiveInactiveSort(filteredData);

    if (errorGetUsers) return <ErrorPage error={errorGetUsers} />;
    if (isLoadingGetUsers) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allUsers}>
                <Box sx={{ p: 2 }}>
                    {(secondaryTabValue === 1 ? usersActive : usersOff).length > 0 ? (
                        (secondaryTabValue === 1 ? usersActive : usersOff).map(user => (
                            <React.Fragment key={user._id}>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item xs={5} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={user.userName}
                                            secondary={user?.branch?.nameBranch}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={user.email}
                                            secondary={user.role}
                                        />
                                    </Grid>
                                    <Grid item xs={1} >
                                        <IconButton onClick={() => setShowEditUser(user)}>
                                            <MoreVertOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider />
                                {showEditUser._id === user._id &&
                                    <EditUser
                                        setShowEditUser={setShowEditUser}
                                        user={user}
                                        allBranches={allBranches}
                                    />
                                }
                            </React.Fragment>
                        ))) : <Typography>אין משתמשים להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    )
};


const EditUser = props => {
    const { setShowEditUser, user, allBranches } = props;
    const [removeUser, { error: errorRemoveUser, isLoading: isLoadingDelete }] = useRemoveUserMutation();
    const [editUser, { error: errorEdit, isLoading: isLoadingEdit }] = useEditUserMutation();
    const [formEdit, setFormEdit] = useState({_id: user._id, active: user.active ,userName: '', email: '', role: '', branch: ''});

    const fields = [
        { name: 'userName', label: 'שם משתמש', typeInput: 'text', type: 'input' },
        { name: 'email', label: 'אמייל', typeInput: 'email', type: 'input' },
        { name: 'branch', label: 'סניף', type: 'select', options: allBranches, optionsValue: 'nameBranch' ,optionsValueToShow: '_id' },
        { name: 'role', label: 'תפקיד', type: 'select', options: roles, optionsValue: 'name', disabled: true },
    ];

    const handleEditItem = async userUpdated => {
        try {
            await editUser(userUpdated).unwrap();
            setShowEditUser(false);
        } catch (err) { }
    }

    const deleteUser = async _id => {
        try {
            await removeUser(_id).unwrap();
        } catch (err) { }
    }

    return (
        <DialogSendInvitation
            title='ערוך משתמש'
            cart={false}
            setOpenDialog={setShowEditUser}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveUser?.data || errorRemoveUser}
            labelDelete='מחק לצמיתות'
            labelConfirm="שמור"
            isLoadingDelete={isLoadingDelete}
            actionDelete={() => deleteUser(user._id)}
            fields={
                <>
                    <FormControlLabel
                        label={formEdit.active ? 'פעיל' : 'לא פעיל'}
                        control={
                            <Switch
                                name="active"
                                checked={formEdit.active}
                                onChange={e => setFormEdit(old => ({ ...old, active: e.target.checked }))}
                            />
                        } />
                    {fields.map(field => (
                        <React.Fragment key={field.name}>
                            { field.type === 'input' ? 
                                <CustomField
                                    name={field.name}
                                    initialValue={user[field.name]}
                                    value={formEdit[field.name]}
                                    label={field.label}
                                    onChange={e => handleFormHook(e.target, setFormEdit)}
                                    type={field.typeInput}
                                    disabled={!formEdit.active || formEdit.disabled}
                                /> :
                                <CustomSelect 
                                    set={setFormEdit}
                                    nameField={field.name}
                                    value={formEdit[field.name] || user[field.name]?._id || user[field.name]}
                                    label={field.label}
                                    options={field.options}
                                    optionsValue={field.optionsValue}
                                    optionsValueToShow={field.optionsValueToShow ?? null}
                                    disabled={user[field.name] === 'מנהל'  &&field.disabled}
                                />
                            }
                        </React.Fragment>
                    ))}
                </>
            }
        >

        </DialogSendInvitation>
    )
}
