import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from "../dl/slices/categories";
import { handleFormHook } from "./HandleFormHook";

export const SelectCatgoryHook = ({set, form, ifFunc=false, ifGet=true}) => {
    const dispatch = useDispatch();
    const { allCategories } = useSelector( state => state.categories);

    useEffect( () => {
        if (allCategories.length === 0 && ifGet) {
            dispatch(getCategories());
        }
    },[])

    return (
        <select name="category" value={form.category} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            { allCategories && allCategories.map( category => (  
                <option value={category.nameCategory} key={category._id}> {category.nameCategory}</option>
            ))}
        </select>
    )
}