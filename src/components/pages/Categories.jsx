import { useEffect, useState } from "react";
import { handleFormHook } from '../HandleFormHook';
import { useGetCategoriesQuery,
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation } from '../../dl/api/categoriesApi';
import { AppBarSystemManagement, IconDeleteButton, LoudingPage } from "../indexComponents";
import { Box, Typography, CircularProgress, Button, TextField, Stack, Grid, Divider } from "@mui/material";

export const Categories = () => {
    const [newCategory, setNewCategory] = useState({nameCategory: ''});
    const [createNewCategory, { error, isLoading, data }] = useCreateNewCategoryMutation();
    const [valueTab, setValueTab] = useState(1);
    const tabs = ['צור קטגוריה חדשה', 'קטגוריות'];

    const handleSaveNewCategory = async () => {
        try {
            await createNewCategory({newCategory}).unwrap();
            setNewCategory({nameCategory: ''})
        }catch (err) { return }
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
            <AppBarSystemManagement tabs={tabs} valueTab={valueTab} changeTab={changeTab}/>
            { valueTab === 0 ? 
                (<Stack sx={{p: '20px'}} spacing={1}>
                    <TextField
                    id="filled-textarea"
                    name="nameCategory"
                    value={newCategory.nameCategory}
                    label="שם קטגוריה"
                    onChange={e => handleFormHook(e.target, setNewCategory)}
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
                    { data && <Typography variant="button" color="success">{data.message}</Typography>}
                    <Button onClick={handleSaveNewCategory} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'שמור'}
                    </Button>
                </Stack>) :
                (
                    <ShowCategories />
                )
            }
        </Box>  
    )
};

const ShowCategories = () => {
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const [removeCategory, { error: errorRemoveCategory }] = useRemoveCategoryMutation();

    const deleteCategory = async _id => {
        try {
            await removeCategory(_id).unwrap();
        }catch (err) {  }
    }

    if (errorGetCategories) return <h3>ERROR: {errorGetCategories.error}</h3>
    if (isLoadingGetCategories) return <LoudingPage />;

    return (
        <Box sx={{ p: 2 }}>
            {allCategories && allCategories.length > 0 ? 
                allCategories.map( category => (
                    <div key={category._id}>
                    <Grid container alignItems="center" justifyContent="space-between" >
                        <Grid item>
                            <Typography>
                                {category.nameCategory}
                            </Typography>
                        </Grid>
                        <Grid item sx={{p: 1}}>
                            <IconDeleteButton action={() => deleteCategory(category._id)} 
                            title={errorRemoveCategory?.message ?? 'מחק'} />
                        </Grid>
                    </Grid>
                    <Divider/>
                    </div>
                )) : <Typography>אין קטגוריות להצגה</Typography>
            }
        </Box>
    )
}