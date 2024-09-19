import React, { useEffect, useState } from "react";
import { handleFormHook } from "../../hooks/HandleFormHook";
import {
    useGetSuppliersQuery,
    useCreateNewSupplierMutation,
    useRemoveSupplierMutation,
    useEditSupplierMutation
} from '../../dl/api/suppliersApi';
import { AppBarSystemManagement, LoudingPage, CustomField, TimedAlert } from '../../components/indexComponents'
import { Box, Button, Stack, ListItemText, IconButton, Grid, Divider, CircularProgress, Chip, Typography, useMediaQuery, Switch, FormControlLabel, Fab } from '@mui/material'
import { useFilters } from '../../hooks/useFilters';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import { ErrorPage, DialogSendInvitation } from "../../components/indexComponents";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { StyledPaper } from "../../css/styles/paper";

export const Supplier = () => {
    const [showAddSupplier, setShowAddSupplier] = useState(false);

    return (
        <Box sx={{ margin: '20px 5px' }}>
            {showAddSupplier ?
                <NewSupplier setShowAddSupplier={setShowAddSupplier} /> :
                <ShowSuppliers />
            }
            {!showAddSupplier && <Fab
                color="primary"
                onClick={() => setShowAddSupplier(true)}
                sx={{
                    position: 'fixed',
                    bottom: 80,
                    left: 50,
                    zIndex: 999,
                }}
            >
                <AddIcon />
            </Fab>}
        </Box>
    )
};


const NewSupplier = ({ setShowAddSupplier }) => {
    const [newSupplier, setNewSupplier] = useState({ nameSupplier: '', tel: '', email: '', supplierNumber: '' });
    const [createNewSupplier, { error, isLoading, data }] = useCreateNewSupplierMutation();

    const handleSaveNewSupplier = async () => {
        try {
            await createNewSupplier({ newSupplier }).unwrap();
            setNewSupplier({ nameSupplier: '', tel: '', email: '', supplierNumber: '' })
        } catch (err) { return }
    }

    const fields = [
        { name: 'nameSupplier', label: 'שם ספק', typeInput: 'text', type: 'input' },
        { name: 'supplierNumber', label: 'מספר ח.פ.', typeInput: 'text', type: 'input' },
        { name: 'tel', label: 'טלפון', typeInput: 'tel', type: 'input' },
        { name: 'email', label: 'אימייל', typeInput: 'email', type: 'input' },
    ];

    return (
        <Stack sx={{ p: '5px' }} spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">יצירת ספק חדש</Typography>
                <IconButton onClick={() => setShowAddSupplier(false)} >
                    <Typography variant="body2">רשימת ספקים</Typography>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>
            {fields.map(field => (
                <React.Fragment key={field.name}>
                    <CustomField
                        name={field.name}
                        value={newSupplier[field.name]}
                        label={field.label}
                        onChange={e => handleFormHook(e.target, setNewSupplier)}
                    />
                </React.Fragment>
            ))}
            {error && <TimedAlert message={error} />}
            {data && <TimedAlert message={data} severity={'success'} />}
            <Button onClick={handleSaveNewSupplier} color="primary" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'שמור'}
            </Button>
        </Stack>
    )
}
const ShowSuppliers = () => {
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [showEditSupplier, setShowEditSupplier] = useState(false);

    const filterFields = ['active'];
    const { filteredData, filters, updateFilter, setData, data } = useFilters(filterFields);

    useEffect(() => {
        if (allSuppliers) {
            setData(allSuppliers)
        }
    }, [allSuppliers]);

    if (errorGetsuppliers) return <ErrorPage error={errorGetsuppliers} />
    if (isLoadingGetsuppliers) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={data}>
                <Box>
                    <Typography variant="h5" sx={{  textAlign: 'right', color: 'text.primary' }}>
                        ספקים
                    </Typography>
                    {filteredData.length > 0 ? (
                        filteredData.map(supplier => (
                            <React.Fragment key={supplier._id}>
                                <StyledPaper
                                    elevation={2}
                                    active={supplier.active.toString()}
                                    onClick={() => setShowEditSupplier(supplier)}
                                >
                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                        <Grid item  sx={{ textAlign: 'right' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                                {supplier.nameSupplier}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {supplier.supplierNumber}
                                            </Typography>
                                        </Grid>
                                        <Grid item  sx={{ textAlign: 'left' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                                {supplier.email}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {supplier.tel}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </StyledPaper>
                                <Divider />
                                {showEditSupplier._id === supplier._id &&
                                    <EditSupplier
                                        setShowEditSupplier={setShowEditSupplier}
                                        supplier={supplier}
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
    )
}

const EditSupplier = props => {
    const { setShowEditSupplier, supplier } = props;
    const [removeSupplier, { error: errorRemoveSupplier, isLoading: isLoadingDelete }] = useRemoveSupplierMutation();
    const [editSupplier, { error: errorEdit, isLoading: isLoadingEdit }] = useEditSupplierMutation();
    const [formEdit, setFormEdit] = useState({ _id: supplier._id, active: supplier.active, nameSupplier: '', tel: '', email: '', supplierNumber: '' });

    const fields = [
        { name: 'nameSupplier', label: 'שם ספק', typeInput: 'text', type: 'input' },
        { name: 'tel', label: 'פלאפון ספק', typeInput: 'tel', type: 'input' },
        { name: 'email', label: 'אימייל ספק', typeInput: 'email', type: 'input' },
        { name: 'supplierNumber', label: 'מספר ספק', typeInput: 'text', type: 'input' }
    ];

    const handleEditItem = async supplierUpdated => {
        try {
            await editSupplier(supplierUpdated).unwrap();
            setShowEditSupplier(false);
        } catch (err) { }
    }

    const deleteSupplier = async _id => {
        try {
            await removeSupplier(_id).unwrap();
            setShowEditSupplier(false);
        } catch (err) { }
    }

    return (
        <DialogSendInvitation
            title='ערוך ספק'
            cart={false}
            setOpenDialog={setShowEditSupplier}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveSupplier}
            labelDelete='מחק לצמיתות'
            labelConfirm="שמור"
            isLoadingDelete={isLoadingDelete}
            actionDelete={() => deleteSupplier(supplier._id)}
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
                                initialValue={supplier[field.name]}
                                value={formEdit[field.name]}
                                label={field.label}
                                onChange={e => handleFormHook(e.target, setFormEdit)}
                                type={field.typeInput}
                                disabled={!formEdit.active || false}
                            />
                        </React.Fragment>
                    ))}
                </>
            }
        >

        </DialogSendInvitation>
    )
}