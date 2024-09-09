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
import { AppBarSystemManagement, LoudingPage, CustomField, TimedAlert } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, ListItemText, FormControlLabel, Switch, IconButton, Fab } from "@mui/material";
import { FilterRow } from "../../components/filters/FilterRow";
import { useFilters } from '../../hooks/useFilters';
import { useActiveInactiveSort } from '../../hooks/useActiveInactiveSort';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { ErrorPage, DialogSendInvitation, CustomSelect } from "../../components/indexComponents";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { StyledPaper } from '../../css/styles/paper';

export const Users = () => {
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    const [showAddUser, setShowAddUser] = useState(false);

    if (errorGetBranches) return <ErrorPage error={errorGetBranches} />
    if (isLoadingGetBranches) return <LoudingPage />

    return (
        <Box sx={{ margin: '20px 5px'}}>
            {showAddUser ?
                <NewUser setShowAddUser={setShowAddUser} allBranches={allBranches} /> :
                <ShowUsers allBranches={allBranches} /> 
            }
            {!showAddUser && <Fab
                color="primary"
                onClick={() => setShowAddUser(true)}
                sx={{
                    position: 'fixed',
                    bottom: 40,
                    left: 46,
                }}
            >
                <AddIcon />
            </Fab>}
        </Box>
    )
}

const NewUser = ({setShowAddUser, allBranches}) => {
    const [formCreateUser, setFormCreateUser] = useState(
        { userName: '', email: '', role: '', branch: '' });
    const [createNewUser, { error, isLoading, data }] = useCreateNewUserMutation();  
  
    const createUser = async () => {
        try {
            await createNewUser(formCreateUser).unwrap();
            setFormCreateUser({ userName: '', password: '', email: '', role: '', branch: '' });
        } catch (err) { }
    }

    const fields = [
        { name: 'userName', label: 'שם משתמש', typeInput: 'text', type: 'input' },
        { name: 'email', label: 'אמייל', typeInput: 'email', type: 'input' },
        { name: 'role', label: 'תפקיד', type: 'select', options: roles, optionsValue: 'name' },
        { name: 'branch', label: 'סניף', type: 'select', options: allBranches, optionsValue: 'nameBranch' ,optionsValueToShow: '_id' },
    ];
    
    return (
        <Stack sx={{ p: '5px' }} spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">יצירת משתמש חדש</Typography>
                <IconButton onClick={() => setShowAddUser(false)} >
                    <Typography variant="body2">רשימת המשתמשים</Typography>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

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
                {error && <TimedAlert message={error}  />}
                {data && <TimedAlert message={data} severity={'success'} /> } 
            <Button onClick={createUser} color="primary" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'שמור'}
            </Button>
        </Stack>
    )
}

const ShowUsers = ({ allBranches }) => {
    const { data: allUsers, error: errorGetUsers, isLoading: isLoadingGetUsers } = useGetUsersQuery();
    const [showEditUser, setShowEditUser] = useState(false);

    const filterFields = ['active'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allUsers) {
            setData(allUsers)
        }
    }, [allUsers]);

    if (errorGetUsers) return <ErrorPage error={errorGetUsers} />;
    if (isLoadingGetUsers) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allUsers}>
                <Box>
                    <Typography variant="h5" sx={{ textAlign: 'right', color: 'text.primary' }}>
                        משתמשים
                    </Typography>
                    {filteredData.length > 0 ? (
                       filteredData.map(user => (
                            <React.Fragment key={user._id}>
                                <StyledPaper 
                                    elevation={2}
                                    active={user.active.toString()}
                                    onClick={() => setShowEditUser(user)}
                                >
                                <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                    <Grid item xs={5} sx={{ minWidth: '100px', textAlign: 'right' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                            {user.userName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.branch?.nameBranch}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={7} sx={{ minWidth: '100px', textAlign: 'left' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                            {user.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user.role}
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>
                                </StyledPaper>
                                <Divider />
                                {showEditUser._id === user._id &&
                                    <EditUser
                                        setShowEditUser={setShowEditUser}
                                        user={user}
                                        allBranches={allBranches}
                                    />
                                }
                            </React.Fragment>
                        ))) : <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                לא נמצאו משתמשים
                            </Typography>
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
            errorMessage={errorEdit || errorRemoveUser}
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
