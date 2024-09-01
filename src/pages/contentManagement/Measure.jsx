import React, { useState, useEffect } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetMeasuresQuery,
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation,
    useEditMeasureMutation
} from '../../dl/api/measuresApi';
import { AppBarSystemManagement, LoudingPage, CustomField, ErrorPage, DialogSendInvitation, TimedAlert } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, FormControlLabel, Switch, IconButton } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

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

                    {error && <TimedAlert message={error}  />}
                    {data && <TimedAlert message={data} severity={'success'} /> }
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
    const [showEditMeasure, setShowEditMeasure] = useState(false);

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allMeasures) {
            setData(allMeasures)
        }
    }, [allMeasures]);

    const [measursActive, measursOff] = useActiveInactiveSort(filteredData);

    if (errorGetMeasures) return <ErrorPage error={errorGetMeasures} />
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
                                    <Grid item >
                                        <IconButton onClick={() => setShowEditMeasure(measure)}>
                                            <MoreVertOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider />
                                {showEditMeasure._id === measure._id &&
                                    <EditMeasure
                                        setShowEditMeasure={setShowEditMeasure}
                                        measure={measure}
                                    />
                                }
                            </div>
                        ))) : <Typography>אין יחידות מידה להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    );
}


const EditMeasure = props => {
    const { setShowEditMeasure, measure } = props;
    const [removeMeasure, { error: errorRemoveMeasure, isLoading: isLoadingDelete }] = useRemoveMeasureMutation();
    const [editMeasure, { error: errorEdit, isLoading: isLoadingEdit }] = useEditMeasureMutation();
    const [formEdit, setFormEdit] = useState({_id: measure._id, active: measure.active ,measureName: ''});

    const fields = [
        { name: 'measureName', label: 'שם יחידת מידה', typeInput: 'text', type: 'input' },
    ];

    const handleEditItem = async measureUpdated => {
        try {
            await editMeasure(measureUpdated).unwrap();
            setShowEditMeasure(false);
        } catch (err) { }
    }

    const deleteMeasure = async _id => {
        try {
            await removeMeasure(_id).unwrap();
        } catch (err) { }
    }

    return (
        <DialogSendInvitation
            title='ערוך יחידת מידה'
            cart={false}
            setOpenDialog={setShowEditMeasure}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveMeasure}
            labelDelete='מחק לצמיתות'
            labelConfirm="שמור"
            isLoadingDelete={isLoadingDelete}
            actionDelete={() => deleteMeasure(measure._id)}
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
                        } />

                    {fields.map(field => (
                        <React.Fragment key={field.name}>
                            <CustomField
                                name={field.name}
                                initialValue={measure[field.name]}
                                value={formEdit[field.name]}                                label={field.label}
                                onChange={e => handleFormHook(e.target, setFormEdit)}
                                type={field.typeInput}
                                disabled={!formEdit.active || false}
                            />
                        </React.Fragment>
                    ))}
                </>
            }
        />
    )
}