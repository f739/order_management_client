import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers } from "../dl/slices/suppliers";
import { handleFormHook } from "./HandleFormHook";

export const SelectSuppliersHook = ({set, form, ifFunc=false, ifGet=true}) => {
    const dispatch = useDispatch();
    const { allSuppliers, isLoading } = useSelector( state => state.suppliers);

    useEffect( () => {
        if (allSuppliers.length === 0 && ifGet) {
            dispatch(getSuppliers());
        }
    },[])

    return (
        <select id="suppliers-select" name="_idSupplier" value={form._idSupplier} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            <option value="">--בחר ספק--</option>
            { allSuppliers && allSuppliers.map(supplier => (  
                <option value={supplier._id} key={supplier._id}> {supplier.nameSupplier} ({supplier.email})</option>
            ))}
        </select>
    )
}