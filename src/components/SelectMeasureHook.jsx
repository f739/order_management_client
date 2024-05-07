import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getMeasures } from "../dl/slices/measures";
import { handleFormHook } from "./HandleFormHook";

export const SelectMeasureHook = ({set, form, ifFunc=false, ifGet=true}) => {
    const dispatch = useDispatch();
    const { allMeasures } = useSelector( state => state.measures);

    useEffect( () => {
        if (allMeasures.length === 0 && ifGet) {
            dispatch(getMeasures());
        }
    },[])

    return (
        <select name="unitOfMeasure" value={form.unitOfMeasure} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            { allMeasures && allMeasures.map( measure => (  
                <option value={measure.measureName} key={measure._id}> {measure.measureName}</option>
            ))}
        </select>
    )
}