import React, { useEffect, useState } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetBranchesQuery,
    useCreateNewBranchMutation,
    useRemoveBranchMutation,
    useEditBranchMutation
} from '../../dl/api/branchesApi';
import { AppBarSystemManagement, LoudingPage, CustomField, ErrorPage, DialogSendInvitation} from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, ListItemText, IconButton, FormControlLabel, Switch } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";

export const Branches = () => {
    const [newBranch, setNewBranch] = useState({ nameBranch: '', address: '' });
    const [createNewBranch, { error, isLoading, data }] = useCreateNewBranchMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור סניף חדש', 'סניפים פעילים', 'סניפים שאינם פעילים'];

    const handleSaveNewCategory = async () => {
        try {
            await createNewBranch({ newBranch }).unwrap();
            setNewBranch({ nameBranch: '', address: '' })
        } catch (err) { return }
    }

    const changeTab = (e, newValue) => {
        setSecondaryTabValue(newValue)
    }

    const fields = [
        { name: 'nameBranch', label: 'שם סניף', typeInput: 'text', type: 'input' },
        { name: 'address', label: 'כתובת', typeInput: 'text', type: 'input' },
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
                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={handleSaveNewCategory} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowBranches secondaryTabValue={secondaryTabValue} />
                )
            }
        </Box>
    )
};

const ShowBranches = ({secondaryTabValue}) => {
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    const [showEditBranch, setShowEditBranch] = useState(false);

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allBranches) {
            setData(allBranches)
        }
    }, [allBranches]);

    const [branchesActive, branchesOff] = useActiveInactiveSort(filteredData);

    if (errorGetBranches) return <ErrorPage error={errorGetBranches} />
    if (isLoadingGetBranches) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allBranches}>
                <Box sx={{ p: 2 }}>
                {(secondaryTabValue === 1 ? branchesActive : branchesOff).length > 0 ? (
                        (secondaryTabValue === 1 ? branchesActive : branchesOff).map(branch => (
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
            errorMessage={errorEdit || errorRemoveBranch?.data || errorRemoveBranch}
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
