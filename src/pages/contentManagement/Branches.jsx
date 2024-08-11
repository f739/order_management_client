import { useEffect, useState } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetBranchesQuery,
    useCreateNewBranchMutation,
    useRemoveBranchMutation
} from '../../dl/api/branchesApi';
import { AppBarSystemManagement, IconDeleteButton, LoudingPage, CustomField } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, ListItemText } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";

export const Branches = () => {
    const [newBranch, setNewBranch] = useState({ nameBranch: '', address: '' });
    const [createNewBranch, { error, isLoading, data }] = useCreateNewBranchMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור סניף חדש', 'סניפים'];

    const handleSaveNewCategory = async () => {
        try {
            await createNewBranch({ newBranch }).unwrap();
            setNewBranch({ nameBranch: '', address: '' })
        } catch (err) { return }
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
                        name="nameBranch"
                        value={newBranch.nameBranch}
                        label="שם סניף"
                        onChange={e => handleFormHook(e.target, setNewBranch)}
                    />
                    <CustomField
                        name="address"
                        value={newBranch.address}
                        label="כתובת מלאה של הסניף"
                        onChange={e => handleFormHook(e.target, setNewBranch)}
                    />

                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={handleSaveNewCategory} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowBranches />
                )
            }
        </Box>
    )
};

const ShowBranches = () => {
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();
    const [removeBranch, { error: errorRemoveBranch }] = useRemoveBranchMutation();

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allBranches) {
            setData(allBranches)
        }
    }, [allBranches]);

    const deleteBranch = async _id => {
        try {
            await removeBranch(_id).unwrap();
        } catch (err) { }
    }

    if (errorGetBranches) return <h3>ERROR: {errorGetBranches.error}</h3>
    if (isLoadingGetBranches) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allBranches}>
                <Box sx={{ p: 2 }}>
                    {filteredData.length > 0 ?
                        filteredData.map(branch => (
                            <div key={branch._id}>
                                <Grid container alignItems="center" justifyContent="space-between" >
                                    <Grid item>
                                        <ListItemText
                                            primary={branch.nameBranch}
                                            secondary={branch.address}
                                        />
                                    </Grid>
                                    <Grid item sx={{ p: 1 }}>
                                        <IconDeleteButton action={() => deleteBranch(branch._id)}
                                            title={errorRemoveBranch?.message ?? 'מחק'} />
                                    </Grid>
                                </Grid>
                                <Divider />
                            </div>
                        )) : <Typography>אין סניפים להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    )
}