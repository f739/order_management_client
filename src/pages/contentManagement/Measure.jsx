import { useState, useEffect } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetMeasuresQuery,
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation,
    useChangeActiveMeasureMutation
} from '../../dl/api/measuresApi';
import { AppBarSystemManagement, IconDeleteButton, LoudingPage, CustomField } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, FormControlLabel, Switch } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";

export const Measure = () => {
    const [newMeasure, setNewMeasure] = useState({ measureName: '' });
    const [createNewMeasure, { error, isLoading, data }] = useCreateNewMeasureMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור יחידת מידה חדשה', 'יחידות מידה פעילות', 'יחידות מידה שאינן פעילות'];

    const handleSaveNewMeasure = async () => {
        try {
            await createNewMeasure({ newMeasure }).unwrap();
            setNewMeasure({ measureName: '' })
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
                        name="measureName"
                        value={newMeasure.measureName}
                        label="שם יחידת מידה"
                        onChange={e => handleFormHook(e.target, setNewMeasure)}
                    />

                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={handleSaveNewMeasure} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) : <ShowMeasures secondaryTabValue={secondaryTabValue} />
            }
        </Box>
    )
};

const ShowMeasures = ({ secondaryTabValue }) => {

    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const [removeMeasure, { error: errorRemoveMeasure }] = useRemoveMeasureMutation();
    const [changeActiveMeasure, { error: errorChangeActivemeasure }] = useChangeActiveMeasureMutation();


    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allMeasures) {
            setData(allMeasures)
        }
    }, [allMeasures]);

    const [measursActive, measursOff] = useActiveInactiveSort(filteredData);

    const deleteMeasure = async _id => {
        try {
            await removeMeasure(_id).unwrap();
        } catch (err) { }
    }

    const handleChangeActive = async (checked, measureId) => {
        try {
            await changeActiveMeasure({ active: checked, measureId }).unwrap();
        } catch (err) { }
    }

    if (errorGetMeasures) return <h3>ERROR: {errorGetMeasures.error}</h3>
    if (isLoadingGetMeasures) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allMeasures}>
                <Box sx={{ p: 2 }}>
                    {(secondaryTabValue === 1 ? measursActive : measursOff).length > 0 ? (
                        (secondaryTabValue === 1 ? measursActive : measursOff).map(measure => (
                            <div key={measure._id}>
                                <Grid container alignItems="center" justifyContent="space-between" >
                                    <Grid item>
                                        <Typography>
                                            {measure.measureName}
                                        </Typography>
                                    </Grid>
                                    <Grid item  >
                                        {errorChangeActivemeasure && '!'}
                                        <FormControlLabel
                                            label={measure.active ? 'פעיל' : 'לא פעיל'}
                                            control={
                                                <Switch
                                                    name="active"
                                                    checked={measure.active || false}
                                                    onChange={e => handleChangeActive(e.target.checked, measure._id)}
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item sx={{ p: 1 }}>
                                        <IconDeleteButton action={() => deleteMeasure(measure._id)}
                                            title={errorRemoveMeasure?.message ?? 'מחק'} />
                                    </Grid>
                                </Grid>
                                <Divider />
                            </div>
                        ))) : <Typography>אין יחידות מידה להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    );
}