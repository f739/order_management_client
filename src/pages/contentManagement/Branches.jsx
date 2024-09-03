import React, { useEffect, useState } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetBranchesQuery,
    useCreateNewBranchMutation,
    useRemoveBranchMutation,
    useEditBranchMutation
} from '../../dl/api/branchesApi';
import { LoudingPage, CustomField, ErrorPage, DialogSendInvitation, TimedAlert} from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, ListItemText, IconButton, FormControlLabel, Switch, Fab } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const Branches = () => {
    const [showAddBranch, setShowAddBranch] = useState(false);

    return (
        <Box sx={{ margin: '20px 5px'}}>
            {showAddBranch ?
                <NewBranch setShowAddBranch={setShowAddBranch} /> :
                <ShowBranches /> 
            }
            {!showAddBranch && <Fab
                color="primary"
                onClick={() => setShowAddBranch(true)}
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
};

const NewBranch = ({setShowAddBranch}) => {
    const [newBranch, setNewBranch] = useState({ nameBranch: '', address: '' });
    const [createNewBranch, { error, isLoading, data }] = useCreateNewBranchMutation();

    const fields = [
        { name: 'nameBranch', label: 'שם סניף', typeInput: 'text', type: 'input' },
        { name: 'address', label: 'כתובת', typeInput: 'text', type: 'input' },
    ];

    const handleSaveNewCategory = async () => {
        try {
            await createNewBranch({ newBranch }).unwrap();
            setNewBranch({ nameBranch: '', address: '' })
        } catch (err) { return }
    }

    return (
        <Stack spacing={1} sx={{ padding: '5px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">יצירת סניף חדש</Typography>
                <IconButton onClick={() => setShowAddBranch(false)} >
                    <Typography variant="body2">רשימת הסניפים</Typography>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

            { fields.map( field => (
                <React.Fragment key={field.name}>
                <CustomField 
                name={field.name}
                value={newBranch[field.name]}
                label={field.label}
                onChange={e => handleFormHook(e.target, setNewBranch)}
                />
                </React.Fragment>
            ))}
            {error && <TimedAlert message={error}  />}
            {data && <TimedAlert message={data} severity={'success'} /> }
            <Button onClick={handleSaveNewCategory} color="primary" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'שמור'}
            </Button>
        </Stack>
    )
}

const ShowBranches = () => {
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    const [showEditBranch, setShowEditBranch] = useState(false);

    const filterFields = ['active'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allBranches) {
            setData(allBranches)
        }
    }, [allBranches]);

    if (errorGetBranches) return <ErrorPage error={errorGetBranches} />
    if (isLoadingGetBranches) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allBranches}>
                <Box>
                <Typography variant="h6">רשימת הסניפים</Typography>
                {filteredData.length > 0 ? (
                        filteredData.map(branch => (
                            <React.Fragment key={branch._id}>
                                <Grid container alignItems="center" justifyContent="space-between" >
                                    <Grid item>
                                        <ListItemText
                                            primary={branch.nameBranch}
                                            secondary={branch.address}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <IconButton onClick={() => setShowEditBranch(branch)}>
                                            <MoreVertOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider />
                                {showEditBranch._id === branch._id &&
                                    <EditBranch
                                        setShowEditBranch={setShowEditBranch}
                                        branch={branch}
                                    />
                                }
                            </React.Fragment>
                            )
                        )) : <Typography>אין סניפים להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    )
};


const EditBranch = props => {
    const { setShowEditBranch, branch } = props;
    const [removeBranch, { error: errorRemoveBranch, isLoading: isLoadingDelete }] = useRemoveBranchMutation();
    const [editBranch, { error: errorEdit, isLoading: isLoadingEdit }] = useEditBranchMutation();
    const [formEdit, setFormEdit] = useState({_id: branch._id, active: branch.active ,branchName: '', address: ''});

    const fields = [
        { name: 'nameBranch', label: 'שם סניף', typeInput: 'text', type: 'input' },
        { name: 'address', label: 'כתובת', typeInput: 'text', type: 'input' },
    ];

    const handleEditItem = async branchUpdated => {
        try {
            await editBranch(branchUpdated).unwrap();
            setShowEditBranch(false);
        } catch (err) { }
    }

    const deleteBranch = async _id => {
        try {
            await removeBranch(_id).unwrap();
        } catch (err) { }
    }

    return (
        <DialogSendInvitation
            title='ערוך סניף'
            cart={false}
            setOpenDialog={setShowEditBranch}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveBranch}
            labelDelete='מחק לצמיתות'
            labelConfirm="שמור"
            isLoadingDelete={isLoadingDelete}
            actionDelete={() => deleteBranch(branch._id)}
            fields={
                <>
                    <FormControlLabel
                        label={formEdit.active ? 'פעיל' : 'לא פעיל'}
                        control={
                            <Switch
                                name="active"
                                checked={formEdit.active || false}
                                onChange={e => setFormEdit(old => ({ ...old, active: e.target.checked }))}
                            />
                        } 
                    />
                    {fields.map(field => (
                        <React.Fragment key={field.name}>
                            <CustomField
                                name={field.name}
                                initialValue={branch[field.name]}
                                value={formEdit[field.name]}                                label={field.label}
                                onChange={e => handleFormHook(e.target, setFormEdit)}
                                type={field.typeInput}
                                disabled={!formEdit.active || formEdit.disabled}
                            />
                        </React.Fragment>
                    ))}
                </>
            }
        />
    )
}
