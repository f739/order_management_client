import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, createNewCategory, removeCategory } from "../dl/slices/categories";
import { handleFormHook } from './HandleFormHook';
import trash_icon from '../assetes/trash_icon.png';
import '../css/categories.css';

export const Categories = () => {
    const dispatch = useDispatch();
    const [newCategory, setNewCategory] = useState({nameCategory: ''});
    const allCategories = useSelector( state => state.categories.allCategories);
    const errorMessage = useSelector( state => state.categories.errorMessage);
    
    useEffect(() => {
        if (allCategories.length === 0) {
            dispatch(getCategories());
        }
    }, [dispatch]);

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
            <div className="show-items">
                <h1 className="title">קטגוריות קיימות:</h1>
                {allCategories.length > 0 && allCategories.map( category => (
                    <ShowCategories key={category._id}
                    nameCategory={category.nameCategory}  
                    dispatch={dispatch}  
                    _id={category._id} />
                ))}
            </div>
        </div>
        
    )
};

const ShowCategories = props => {
    const { nameCategory, _id, dispatch } = props;
    const deleteCategory = () => {
        dispatch(removeCategory(_id))
    }
    return (
        <div className="show-item">
            <span>{nameCategory}</span>
            <button onClick={deleteCategory} className="delete-item">
                <img src={trash_icon} alt="delete" />
            </button>
        </div>
    )
}