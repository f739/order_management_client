import { useEffect, useState } from "react";
import { URL } from "../services/service";
import $ from 'axios';
import '../css/categories.css';
import { handleFormHook } from './HandleFormHook';

export const Categories = () => {
    const [newCategory, setNewCategory] = useState({nameCategory: ''});
    const [allCategories, setAllCategories] = useState([]);

    useEffect( () => {
        const getCategories = async () => {
            try {
                const res = await $.get(`${URL}/categories/getAllCategories`);
                console.log(res);
                setAllCategories(res.data.allcategories)
            }catch (err) {
                console.log(err);
            }
        }; getCategories();
    },[]);

    const handleSaveNewCategory  = async () => {
        try {
            const res = await $.post(`${URL}/categories/newCategory`, newCategory);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="category">
            <div className="new-category">
                <label>
                    שם קטגוריה:
                    <input type="text" name="nameCategory" onChange={e => handleFormHook(e.target, setNewCategory)}/> 
                </label>
                <button onClick={handleSaveNewCategory}>שמור קטגוריה חדשה</button>
            </div>
            <div className="show-category">
                <h1 className="title">קטגוריות קיימות:</h1>
                {allCategories && allCategories.map( category => (
                    <ShowCategories key={category._id}
                    nameCategory={category.nameCategory}  
                    id={category._id} />
                ))}
            </div>
        </div>
        
    )
};

const ShowCategories = props => {
    const { nameCategory, id } = props;
    const deleteCategory = async () => {
        try {
            const res = await $.delete(`${URL}/categories/${id}/deleteCategory`);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="show-categories">
            <span>{nameCategory}</span>
            <button onClick={deleteCategory}>מחק קטגוריה</button>
        </div>
    )
}