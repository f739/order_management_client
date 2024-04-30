import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers } from "../dl/slices/suppliers";
import { handleFormHook } from "./HandleFormHook";

export const SelectSuppliersHook = ({set, form, ifFunc=false}) => {
    const dispatch = useDispatch();
    const { allSuppliers } = useSelector( state => state.suppliers);
    useEffect( () => {
        if (allSuppliers && allSuppliers.length === 0) {
            dispatch( getSuppliers())
        }
    },[])

    return (
        <select id="suppliers-select" name="_idSupplier" value={form._idSupplier} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            <option value="">--בחר ספק--</option>
            {allSuppliers && allSuppliers.length > 0 && allSuppliers.map(supplier => (  
                <option value={supplier._id} key={supplier._id}> {supplier.nameSupplier} ({supplier.email})</option>
            ))}
        </select>
    )
}