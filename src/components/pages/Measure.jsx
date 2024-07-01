import { useEffect, useState } from "react";
import { handleFormHook } from '../HandleFormHook';
import {
    useGetMeasuresQuery,
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation
} from '../../dl/api/measuresApi';
import { AppBarSystemManagement, IconDeleteButton, LoudingPage } from "../indexComponents";
import { Box, Typography, CircularProgress, Button, TextField, Stack, Grid, Divider } from "@mui/material";

export const Measure = () => {
    const [newMeasure, setNewMeasure] = useState({ measureName: '' });
    const [createNewMeasure, { error, isLoading, data }] = useCreateNewMeasureMutation();
    const [valueTab, setValueTab] = useState(1);
    const tabs = ['צור יחידת מידה חדשה', 'יחידות מידה'];

    const handleSaveNewMeasure = async () => {
        try {
            await createNewMeasure({ newMeasure }).unwrap();
            setNewMeasure({ measureName: '' })
        } catch (err) { return }
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
                    <TextField
                        id="filled-textarea"
                        name="measureName"
                        value={newMeasure.measureName}
                        label="שם יחידת מידה"
                        onChange={e => handleFormHook(e.target, setNewMeasure)}
                        multiline
                        fullWidth
                        variant="filled"
                        sx={{
                            '& label': {
                                right: 25,
                                transformOrigin: 'top right',
                            },
                        }}
                    />
                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={handleSaveNewMeasure} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowMeasures />
                )
            }
        </Box>

    )
};

const ShowMeasures = () => {
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const [removeMeasure, { error: errorRemoveMeasure }] = useRemoveMeasureMutation();

    const deleteMeasure = async _id => {
        try {
            await removeMeasure(_id).unwrap();
        } catch (err) { }
    }
    if (errorGetMeasures) return <h3>ERROR: {errorGetMeasures.error}</h3>
    if (isLoadingGetMeasures) return <LoudingPage />;
    return (
        <Box sx={{ p: 2 }}>
            {allMeasures && allMeasures.length > 0 ?
                allMeasures.map(measure => (
                    <div key={measure._id}>
                        <Grid container alignItems="center" justifyContent="space-between" >
                            <Grid item>
                                <Typography>
                                    {measure.measureName}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ p: 1 }}>
                                <IconDeleteButton action={() => deleteMeasure(measure._id)}
                                    title={errorRemoveMeasure?.message ?? 'מחק'} />
                            </Grid>
                        </Grid>
                        <Divider />
                    </div>
                )) : <Typography>אין משתמשים להצגה</Typography>
            }
        </Box>
    )
}