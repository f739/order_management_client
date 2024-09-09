import React, { useEffect, useState } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetCategoriesQuery,
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation,
    useEditCategoryMutation
} from '../../dl/api/categoriesApi';
import { LoudingPage, CustomField, ErrorPage, DialogSendInvitation, TimedAlert } from "../../components/indexComponents";
import { Box, Typography, IconButton ,CircularProgress, Button, Stack, Grid, Divider, FormControlLabel, Switch, Fab, useMediaQuery } from "@mui/material";
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { StyledPaper } from "../../css/styles/paper";
import { useTheme } from '@mui/material/styles';

export const Categories = () => {
    const [showAddCategory, setShowAddCategory] = useState(false);

    return (
        <Box sx={{ margin: '20px 5px'}}>
            {showAddCategory ?
                <NewCategory setShowAddCategory={setShowAddCategory} /> :
                <ShowCategories /> 
            }
            {!showAddCategory && <Fab
                color="primary"
                onClick={() => setShowAddCategory(true)}
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

const NewCategory = ({ setShowAddCategory }) => {
    const [newCategory, setNewCategory] = useState({ nameCategory: '' });
    const [createNewCategory, { error, isLoading, data }] = useCreateNewCategoryMutation();

    const handleSaveNewCategory = async () => {
        try {
            await createNewCategory({ newCategory }).unwrap();
            setNewCategory({ nameCategory: '' });
        } catch (err) { }
    };

    return (
        <Stack spacing={1} sx={{ padding: '5px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">יצירת קטגוריה חדשה</Typography>
                <IconButton onClick={() => setShowAddCategory(false)} >
                    <Typography variant="body2">רשימת הקטגוריות</Typography>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

            <CustomField
                name="nameCategory"
                value={newCategory.nameCategory}
                label="שם קטגוריה"
                onChange={e => handleFormHook(e.target, setNewCategory)}
            />

            {error && <TimedAlert message={error} />}
            {data && <TimedAlert message={data} severity={'success'} />}
            <Button onClick={handleSaveNewCategory} color="primary" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'שמור'}
            </Button>
        </Stack>
    );
};


const ShowCategories = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const [showEditCategory, setShowEditCategory] = useState(false);

    const filterFields = ['active'];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allCategories) {
            setData(allCategories)
        }
    }, [allCategories]);

    if (errorGetCategories) return <ErrorPage error={errorGetCategories}/>
    if (isLoadingGetCategories) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allCategories}>
                <Box >
                    <Typography variant="h5" sx={{textAlign: 'right', color: 'text.primary' }}>
                        קטגוריות
                    </Typography>
                    {filteredData.length > 0 ? (
                        filteredData.map(category => (
                            <React.Fragment key={category._id}>
                                <StyledPaper 
                                    elevation={2}
                                    active={category.active.toString()}
                                    onClick={() => setShowEditCategory(category)}
                                >
                                <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                    <Grid item sx={{ textAlign: 'right' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                        {category.nameCategory}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {category.active ? 'פעיל' : 'לא פעיל'}
                                    </Typography>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                            <Divider/>
                            {showEditCategory._id === category._id &&
                                <EditCategory
                                    setShowEditCategory={setShowEditCategory}
                                    category={category}
                                />
                            }  
                            </React.Fragment>
                        ))) :
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            אין קטגוריות להצגה
                        </Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    )
}

const EditCategory = props => {
    const { setShowEditCategory, category } = props;
    const [removeCategory, { error: errorRemoveCategory, isLoading: isLoadingDelete }] = useRemoveCategoryMutation();
    const [editCategory, { error: errorEdit, isLoading: isLoadingEdit }] = useEditCategoryMutation();
    const [formEdit, setFormEdit] = useState({_id: category._id, active: category.active ,nameCategory: ''});

    const fields = [
        { name: 'nameCategory', label: 'שם קטגוריה', typeInput: 'text', type: 'input' },
    ];

    const handleEditItem = async categoryUpdated => {
        try {
            await editCategory(categoryUpdated).unwrap();
            setShowEditCategory(false);
        } catch (err) { }
    }

    const deleteCategory = async _id => {
        try {
            await removeCategory(_id).unwrap();
        } catch (err) { }
    }

    return (
        <DialogSendInvitation
            title='ערוך קטגוריה'
            cart={false}
            setOpenDialog={setShowEditCategory}
            sendOrder={() => handleEditItem(formEdit)}
            isLoudingSendOrder={isLoadingEdit}
            errorMessage={errorEdit || errorRemoveCategory}
            labelDelete='מחק לצמיתות'
            labelConfirm="שמור"
            isLoadingDelete={isLoadingDelete}
            actionDelete={() => deleteCategory(category._id)}
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
                                initialValue={category[field.name]}
                                value={formEdit[field.name]}                                label={field.label}
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