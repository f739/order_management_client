import React, { useEffect, useState } from "react";
import { handleFormHook } from "../../hooks/HandleFormHook";
import {
    useGetSuppliersQuery,
    useCreateNewSupplierMutation,
    useRemoveSupplierMutation,
    useEditSupplierMutation
} from '../../dl/api/suppliersApi';
import { AppBarSystemManagement, LoudingPage, CustomField, TimedAlert } from '../../components/indexComponents'
import { Box, Button, Stack, ListItemText, IconButton, Grid, Divider, CircularProgress, Chip, Typography, useMediaQuery, Switch, FormControlLabel } from '@mui/material'
import { useFilters } from '../../hooks/useFilters';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import { ErrorPage, DialogSendInvitation } from "../../components/indexComponents";

export const Supplier = () => {
    const [newSupplier, setNewSupplier] = useState({ nameSupplier: '', tel: '', email: '', supplierNumber: '' });
    const [createNewSupplier, { error, isLoading, data }] = useCreateNewSupplierMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור חדש', 'ספקים פעילים', 'ספקים שאינם פעילים'];

    const handleSaveNewSupplier = async () => {
        try {
            await createNewSupplier({ newSupplier }).unwrap();
            setNewSupplier({ nameSupplier: '', tel: '', email: '', supplierNumber: '' })
        } catch (err) { return }
    }

    const changeTab = (e, newValue) => {
        setSecondaryTabValue(newValue)
    }

    const fields = [
        { name: 'nameSupplier', label: 'שם ספק', typeInput: 'text', type: 'input' },
        { name: 'supplierNumber', label: 'מספר ספק', typeInput: 'text', type: 'input' },
        { name: 'tel', label: 'פלאפון ספק', typeInput: 'tel', type: 'input' },
        { name: 'email', label: 'אימייל ספק', typeInput: 'email', type: 'input' },
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
                                value={newSupplier[field.name]}
                                label={field.label}
                                onChange={e => handleFormHook(e.target, setNewSupplier)}
                            />
                        </React.Fragment>
                    ))}
                    {error && <TimedAlert message={error}  />}
                    {data && <TimedAlert message={data} severity={'success'} /> }                    
                    <Button onClick={handleSaveNewSupplier} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowSuppliers secondaryTabValue={secondaryTabValue} />
                )
            }
        </Box>
    )
};

const ShowSuppliers = ({ secondaryTabValue }) => {
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [showEditSupplier, setShowEditSupplier] = useState(false);

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData, data } = useFilters(filterFields);

    useEffect(() => {
        if (allSuppliers) {
            setData(allSuppliers)
        }
    }, [allSuppliers]);

    const [suppliersActive, suppliersOff] = useActiveInactiveSort(filteredData);

    if (errorGetsuppliers) return <ErrorPage error={errorGetsuppliers} />
    if (isLoadingGetsuppliers) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={data}>
                <Box sx={{ p: 2 }}>
                    {(secondaryTabValue === 1 ? suppliersActive : suppliersOff).length > 0 ? (
                        (secondaryTabValue === 1 ? suppliersActive : suppliersOff).map(supplier => (
                            <div key={supplier._id}>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item xs={5} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={supplier.nameSupplier}
                                            secondary={supplier.supplierNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ minWidth: '100px' }}>
                                        <ListItemText
                                            primary={supplier.email}
                                            secondary={supplier.tel}
                                        />
                                    </Grid>
                                    <Grid item xs={1} >
                                        <IconButton onClick={() => setShowEditSupplier(supplier)}>
                                            <MoreVertOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider />

                                {showEditSupplier._id === supplier._id &&
                                    <EditSupplier
                                        setShowEditSupplier={setShowEditSupplier}
                                        supplier={supplier}
                                    />
                                }
                            </div>
                        ))) : (<div>אין ספקים להצגה</div>)
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
    const [formEdit, setFormEdit] = useState({_id: supplier._id, active: supplier.active ,nameSupplier: '', tel: '', email: '', supplierNumber: ''});

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