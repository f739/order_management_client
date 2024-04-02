import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, createNewCategory, removeCategory } from "../dl/slices/categories";
import { handleFormHook } from './HandleFormHook';
import trash_icon from '../assetes/trash_icon.svg';

export const Categories = () => {
    const dispatch = useDispatch();
    const [newCategory, setNewCategory] = useState({nameCategory: ''});
    const errorMessage = useSelector( state => state.categories.errorMessage);

    const handleSaveNewCategory = () => {
        dispatch( createNewCategory(newCategory));
        setNewCategory({nameCategory: ''})
    }
    return (
        <div className="category">
            <div className="new-item">
                <label>
                    שם קטגוריה:
                    <input type="text" name="nameCategory" value={newCategory.nameCategory} onChange={e => handleFormHook(e.target, setNewCategory)}/> 
                </label>
                <button onClick={handleSaveNewCategory}>שמור קטגוריה חדשה</button>
            </div>
            { errorMessage && <h4 className="error-message">{errorMessage}</h4>}
            <ShowCategories dispatch={dispatch} />
        </div>
        
    )
};

const ShowCategories = props => {
    const { dispatch } = props;
    const {allCategories, isLoading} = useSelector( state => state.categories);

    useEffect(() => {
        if (allCategories.length === 0) {
            dispatch(getCategories());
        }
    }, [dispatch]);

    const deleteCategory = (_id) => {
        dispatch(removeCategory(_id))
    }

    if (isLoading) return <h1>🌀 Loading...</h1>;
    return (
            <div className="show-items">
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