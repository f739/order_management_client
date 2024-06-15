import { useEffect } from "react"
import { useGetMeasuresQuery } from "../dl/api/measuresApi";
import { handleFormHook } from "./HandleFormHook";

export const SelectMeasureHook = ({set, form, ifFunc=false, ifGet=true}) => {
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();

    if (errorGetMeasures) return <h3>ERROR: {errorGetMeasures.error}</h3>
    if (isLoadingGetMeasures) return 'loading...';
    return (
        <select name="unitOfMeasure" value={form.unitOfMeasure} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            { allMeasures && allMeasures.map( measure => (  
                <option value={measure.measureName} key={measure._id}> {measure.measureName}</option>
            ))}
        </select>
    )
}