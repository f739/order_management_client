import { useEffect, useState } from "react";
import { handleFormHook } from './HandleFormHook';
import trash_icon from '../assetes/trash_icon.svg';
import { useGetCategoriesQuery,
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation } from '../dl/api/categoriesApi';
export const Categories = () => {
    const [message, setMessage] = useState('')
    const [newCategory, setNewCategory] = useState({nameCategory: ''});
    const [createNewCategory, { error, isLoading }] = useCreateNewCategoryMutation();

    useEffect(() => {
        if (error) {
            setMessage(error.data?.message || 'An error occurred');
        }
    }, [error]);

    const handleSaveNewCategory = async () => {
        try {
            await createNewCategory(newCategory).unwrap();
            setNewCategory({nameCategory: ''})
        }catch (err) { return }
    }
    return (
        <div className="category">
            <div className="new-item">
                <label>שם קטגוריה:</label>
                <input type="text" name="nameCategory" value={newCategory.nameCategory} onChange={e => handleFormHook(e.target, setNewCategory)}/> 
                <button onClick={handleSaveNewCategory}>שמור קטגוריה חדשה</button>
                <span>{message}</span>
                {isLoading && <span>🌀</span>}
            </div>
            <ShowCategories />
        </div>
        
    )
};

const ShowCategories = () => {
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const [removeCategory, { error: errorRemoveCategory }] = useRemoveCategoryMutation();

    const deleteCategory = async _id => {
        try {
            await removeCategory(_id).unwrap();
        }catch (err) {
            console.log(err);
            console.log(errorRemoveCategory);
        }
    }

    if (errorGetCategories) return <h3>ERROR: {errorGetCategories.error}</h3>
    if (isLoadingGetCategories) return <h1>🌀 Loading...</h1>;
    return (
            <div className="show-items categories-items">
                <h1 className="title">קטגוריות קיימות:</h1>
                {allCategories && allCategories.length > 0 ? allCategories.map( category => (
                <div key={category._id} className="show-item">
                    <span>{category.nameCategory}</span>
                    <button onClick={() => deleteCategory(category._id)} className="delete-item">
                        <img src={trash_icon} alt="delete" className="icon" />
                    </button>  
                </div>
                )) : (<div>אין משתמשים להצגה</div>)}

        </div>
    )
}