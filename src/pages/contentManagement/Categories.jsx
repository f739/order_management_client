import React, { useEffect, useState } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetCategoriesQuery,
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation,
    useEditCategoryMutation
} from '../../dl/api/categoriesApi';
import { AppBarSystemManagement, LoudingPage, CustomField, ErrorPage, DialogSendInvitation, TimedAlert } from "../../components/indexComponents";
import { Box, Typography, IconButton ,CircularProgress, Button, Stack, Grid, Divider, FormControlLabel, Switch } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useFilters } from '../../hooks/useFilters';
import { FilterRow } from "../../components/filters/FilterRow";
import { useActiveInactiveSort } from "../../hooks/useActiveInactiveSort";

export const Categories = () => {
    const [newCategory, setNewCategory] = useState({ nameCategory: '' });
    const [createNewCategory, { error, isLoading, data }] = useCreateNewCategoryMutation();
    const [secondaryTabValue, setSecondaryTabValue] = useState(1);
    const secondaryTabs = ['צור קטגוריה חדשה', 'קטגוריות פעילות', 'קטגוריות שאינן פעילות'];

    const handleSaveNewCategory = async () => {
        try {
            await createNewCategory({ newCategory }).unwrap();
            setNewCategory({ nameCategory: '' })
        } catch (err) { }
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
                        name="nameCategory"
                        value={newCategory.nameCategory}
                        label="שם קטגוריה"
                        onChange={e => handleFormHook(e.target, setNewCategory)}
                    />

                    {error && <TimedAlert message={error}  />}
                    {data && <TimedAlert message={data} severity={'success'} /> }
                    <Button onClick={handleSaveNewCategory} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowCategories secondaryTabValue={secondaryTabValue} />
                )
            }
        </Box>
    )
};

const ShowCategories = ({ secondaryTabValue }) => {
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const [showEditCategory, setShowEditCategory] = useState(false);

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allCategories) {
            setData(allCategories)
        }
    }, [allCategories]);

    const [categoriesActive, categoriesOff] = useActiveInactiveSort(filteredData);

    if (errorGetCategories) return <ErrorPage error={errorGetCategories}/>
    if (isLoadingGetCategories) return <LoudingPage />;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <FilterRow filters={filters} updateFilter={updateFilter} filterFields={filterFields} data={allCategories}>
                <Box sx={{ p: 2 }}>
                    {(secondaryTabValue === 1 ? categoriesActive : categoriesOff).length > 0 ? (
                        (secondaryTabValue === 1 ? categoriesActive : categoriesOff).map(category => (
                            <div key={category._id}>
                                <Grid container alignItems="center" justifyContent="space-between" >
                                    <Grid item>
                                        <Typography>
                                            {category.nameCategory}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <IconButton onClick={() => setShowEditCategory(category)}>
                                            <MoreVertOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider />
                                {showEditCategory._id === category._id &&
                                    <EditCategory
                                        setShowEditCategory={setShowEditCategory}
                                        category={category}
                                    />
                                }
                            </div>
                        ))) : <Typography>אין קטגוריות להצגה</Typography>
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