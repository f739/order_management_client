import { useEffect, useState } from "react";
import { handleFormHook } from "../HandleFormHook";
import { EditItemHook } from "../EditItemHook";
import {
    useGetSuppliersQuery,
    useCreateNewSupplierMutation,
    useRemoveSupplierMutation,
    useEditSupplierMutation
} from '../../dl/api/suppliersApi';
import { AppBarSystemManagement, LoudingPage } from '../indexComponents'
import { Box, TextField, Button, Stack, ListItemText, IconButton, Grid, Divider, CircularProgress, Typography } from '@mui/material'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

export const Supplier = () => {
    const [newSupplier, setNewSupplier] = useState({ nameSupplier: '', tel: '', email: '', supplierNumber: '' });
    const [createNewSupplier, { error, isLoading, data }] = useCreateNewSupplierMutation();
    const [valueTab, setValueTab] = useState(1);
    const tabs = ['צור חדש', 'ספקים פעילים', 'ספקים שאינם פעילים'];

    const handleSaveNewSupplier = async () => {
        try {
            await createNewSupplier({ newSupplier }).unwrap();
            setNewSupplier({ nameSupplier: '', tel: '', email: '', supplierNumber: '' })
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
                        name="nameSupplier"
                        value={newSupplier.nameSupplier}
                        label="שם ספק"
                        onChange={e => handleFormHook(e.target, setNewSupplier)}
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
                    <TextField
                        variant="filled"
                        value={newSupplier.supplierNumber}
                        name="supplierNumber"
                        onChange={e => handleFormHook(e.target, setNewSupplier)}
                        label="מספר ספק"
                        multiline
                        fullWidth
                        sx={{
                            '& label': {
                                right: 25,
                                transformOrigin: 'top right',
                            },
                        }}
                    />
                    <TextField
                        value={newSupplier.tel}
                        name="tel"
                        onChange={e => handleFormHook(e.target, setNewSupplier)}
                        label="פלאפון"
                        multiline
                        fullWidth
                        sx={{
                            '& label': {
                                right: 25,
                                transformOrigin: 'top right',
                            },
                        }}
                        variant="filled"
                    />
                    <TextField
                        variant="filled"
                        value={newSupplier.email}
                        name="email"
                        type="email"
                        onChange={e => handleFormHook(e.target, setNewSupplier)}
                        label="אמייל"
                        multiline
                        fullWidth
                        sx={{
                            '& label': {
                                right: 25,
                                transformOrigin: 'top right',
                            },
                        }}
                    />
                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={handleSaveNewSupplier} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowSuppliers valueTab={valueTab} />
                )
            }
        </Box>
    )
};

const ShowSuppliers = ({ valueTab }) => {
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [removeSupplier, { error: errorRemoveSupplier }] = useRemoveSupplierMutation();
    const [editSupplier, { error: errorEditSupplier }] = useEditSupplierMutation();
    const [showEditSupplier, setShowEditSupplier] = useState(false);

    const fields = [
        { name: 'nameSupplier', label: 'שם ספק', typeInput: 'text', type: 'input' },
        { name: 'tel', label: 'פלאפון ספק', typeInput: 'tel', type: 'input' },
        { name: 'email', label: 'אימייל ספק', typeInput: 'email', type: 'input' },
        { name: 'supplierNumber', label: 'מספר ספק', typeInput: 'text', type: 'input' }
    ];

    const deleteSupplier = async _id => {
        try {
            await removeSupplier(_id).unwrap();
            setShowEditSupplier(false);
        } catch (err) { }
    }
    const handleEditItem = async supplierUpdated => {
        await editSupplier(supplierUpdated);
        setShowEditSupplier(false);
    }
    if (errorGetsuppliers) return <h3>ERROR: {errorGetsuppliers.error}</h3>
    if (isLoadingGetsuppliers) return <LoudingPage />;

    return (
        <Box sx={{ p: 2 }}>
            {allSuppliers && allSuppliers.length > 0 ? (
                allSuppliers.map(supplier => (
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
                            <EditItemHook initialData={showEditSupplier}
                                onSubmit={handleEditItem}
                                fields={fields}
                                setShowEdit={setShowEditSupplier}
                                deleteItem={deleteSupplier}
                            />
                        }
                    </div>
                ))) : (<div>אין ספקים להצגה</div>)
            }
        </Box>
    )
}