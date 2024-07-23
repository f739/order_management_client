import { useEffect, useState } from "react";
import { handleFormHook } from '../../hooks/HandleFormHook';
import {
    useGetCategoriesQuery,
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation,
    useChangeActiveCategoryMutation
} from '../../dl/api/categoriesApi';
import { AppBarSystemManagement, IconDeleteButton, LoudingPage, CustomField } from "../../components/indexComponents";
import { Box, Typography, CircularProgress, Button, Stack, Grid, Divider, FormControlLabel, Switch } from "@mui/material";
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
                        name="nameCategory"
                        value={newCategory.nameCategory}
                        label="שם קטגוריה"
                        onChange={e => handleFormHook(e.target, setNewCategory)}
                    />

                    {error && <Typography variant="button" color="error" >{error.message}</Typography>}
                    {data && <Typography variant="button" color="success">{data.message}</Typography>}
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
    const [removeCategory, { error: errorRemoveCategory }] = useRemoveCategoryMutation();
    const [changeActiveCategory, { error: errorChangeActiveCategory }] = useChangeActiveCategoryMutation();

    const filterFields = [];
    const { filteredData, filters, updateFilter, setData } = useFilters(filterFields);

    useEffect(() => {
        if (allCategories) {
            setData(allCategories)
        }
    }, [allCategories]);

    const [categoriesActive, categoriesOff] = useActiveInactiveSort(filteredData);

    const handleChangeActive = async (checked, categoryId) => {
        try {
            await changeActiveCategory({ active: checked, categoryId }).unwrap();
        } catch (err) { }
    }

    const deleteCategory = async _id => {
        try {
            await removeCategory(_id).unwrap();
        } catch (err) { }
    }

    if (errorGetCategories) return <h3>ERROR: {errorGetCategories.error}</h3>
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
                                    <Grid item  >
                                        {errorChangeActiveCategory && '!'}
                                        <FormControlLabel
                                            label={category.active ? 'פעיל' : 'לא פעיל'}
                                            control={
                                                <Switch
                                                    name="active"
                                                    checked={category.active || false}
                                                    onChange={e => handleChangeActive(e.target.checked, category._id)}
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item sx={{ p: 1 }}>
                                        <IconDeleteButton action={() => deleteCategory(category._id)}
                                            title={errorRemoveCategory?.message ?? 'מחק'} />
                                    </Grid>
                                </Grid>
                                <Divider />
                            </div>
                        ))) : <Typography>אין קטגוריות להצגה</Typography>
                    }
                </Box>
            </FilterRow>
        </Box>
    )
}