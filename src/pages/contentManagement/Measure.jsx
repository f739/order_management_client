import React, { useState, useEffect } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetMeasuresQuery,
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation,
    useEditMeasureMutation
} from '../../dl/api/measuresApi';
import { LoudingPage, CustomField, ErrorPage, DialogSendInvitation, TimedAlert } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, FormControlLabel, Switch, IconButton, Fab } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { StyledPaper } from '../../css/styles/paper';

export const Measure = () => {
    const [showAddMeasure, setShowAddMeasure] = useState(false);

    return (
        <Box sx={{ margin: '20px 5px'}}>
            {showAddMeasure ?
                <NewMeasure setShowAddMeasure={setShowAddMeasure} /> :
                <ShowMeasures /> 
            }
            {!showAddMeasure && <Fab
                color="primary"
                onClick={() => setShowAddMeasure(true)}
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

const NewMeasure = ({setShowAddMeasure}) => {
    const [newMeasure, setNewMeasure] = useState({ measureName: '' });
    const [createNewMeasure, { error, isLoading, data }] = useCreateNewMeasureMutation();

    const handleSaveNewMeasure = async () => {
        try {
            await createNewMeasure({ newMeasure }).unwrap();
            setNewMeasure({ measureName: '' })
        } catch (err) { return }
    }

    return (
        <Stack sx={{ p: '5px' }} spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">יצירת יחידת מידה חדשה</Typography>
                <IconButton onClick={() => setShowAddMeasure(false)} >
                    <Typography variant="body2">רשימת יחידות המידה</Typography>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>
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
        </Stack>
    )
}

const ShowMeasures = () => {
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const [showEditMeasure, setShowEditMeasure] = useState(false);

    const filterFields = ['active'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allMeasures) {
            setData(allMeasures)
        }
    }, [allMeasures]);

    if (errorGetMeasures) return <ErrorPage error={errorGetMeasures} />
    if (isLoadingGetMeasures) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allMeasures}>
                <Box>
                    <Typography variant="h5" sx={{ textAlign: 'right', color: 'text.primary' }}>
                        יחידות מידה
                    </Typography>                    
                    {filteredData.length > 0 ? (
                      filteredData.map(measure => (
                        <React.Fragment key={measure._id}>
                            <StyledPaper 
                                elevation={2}
                                onClick={() => setShowEditMeasure(measure)}
                            >
                                <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                    <Grid item sx={{ textAlign: 'right' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                        {measure.measureName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {measure.active ? 'פעיל' : 'לא פעיל'}
                                    </Typography>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                            <Divider/>
                            {showEditMeasure._id === measure._id &&
                                <EditMeasure
                                    setShowEditMeasure={setShowEditMeasure}
                                    measure={measure}
                                />
                            }
                        </React.Fragment>
                        ))) : 
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            אין ספקים להצגה
                        </Typography>
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