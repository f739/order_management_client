import { useEffect } from "react"
import { handleFormHook } from "./HandleFormHook";
import { useGetCategoriesQuery } from "../dl/api/categoriesApi";

export const SelectCatgoryHook = ({set, form, ifFunc=false, ifGet=true}) => {
    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();

    if (errorGetCategories) return <h3>ERROR: {errorGetCategories.error}</h3>
    if (isLoadingGetCategories) return 'loading...';
    return (
        <select name="category" value={form.category} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            { allCategories && allCategories.map( category => (  
                <option value={category.nameCategory} key={category._id}> {category.nameCategory}</option>
            ))}
        </select>
    )
}