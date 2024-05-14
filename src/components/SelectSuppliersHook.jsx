import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers } from "../dl/slices/suppliers";
import { handleFormHook } from "./HandleFormHook";

export const SelectSuppliersHook = ({set, form, ifFunc=false, ifGet=true, allName=true, isSelected=false}) => {
    const dispatch = useDispatch();
    const { allSuppliers } = useSelector( state => state.suppliers || { allSuppliers: [] });

    useEffect( () => {
        if (allSuppliers.length === 0 && ifGet) {
            dispatch(getSuppliers());
        }
    },[])

    return (
        <select style={!allName ? { width: '20%', border: 'none', margin: '0px' } : {}} className={isSelected ? 'selected-style' : null} name="_idSupplier" value={form._idSupplier} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            {allName && <option value="">--בחר ספק--</option>}
            { allSuppliers && allSuppliers.map(supplier => (  
                <option value={supplier._id} key={supplier._id}> {supplier.nameSupplier} {allName && `(${supplier.email})`}</option>
            ))}
        </select>
    )
}