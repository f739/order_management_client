import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers, createNewSupplier, removeSupplier } from "../dl/slices/suppliers";
import { handleFormHook } from "./HandleFormHook";
import '../css/suppliers.css';

export const Supplier = () => {
    const dispatch = useDispatch();
    const [newSupplier, setNewSupplier] = useState({nameSupplier: '', tel: '', email: ''});
    const allSuppleirs = useSelector( state => state.suppliers.allSuppliers);
    const errorMessage = useSelector( state => state.suppliers.errorMessage);
    
    useEffect(() => {
        if (allSuppleirs.length === 0) {
            dispatch(getSuppliers());
        }
    }, [dispatch]);

    const handleSaveNewSupplier  = async () => {
        dispatch( createNewSupplier(newSupplier));
        setNewSupplier({nameSupplier: '', tel: '', email: ''})
    }
    return (
        <div className="suppliers">
            <div className="new-supplier">
                <label>
                    שם ספק:
                    <input type="text" name="nameSupplier" value={newSupplier.nameSupplier} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 
                </label>
                <label>
                    פלאפון ספק:
                <input type="tel" name="tel" value={newSupplier.tel} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 
                </label>
                <label>
                    אמייל ספק:
                <input type="email" name="email" value={newSupplier.email} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 
                </label>
                <button onClick={handleSaveNewSupplier}>שמור ספק חדש</button>
            </div>
            { errorMessage && <h4 className="error-message">{errorMessage}</h4>}
            <div className="show-supplier">
                <h1 className="title">ספקים קיימים:</h1>
                {allSuppleirs.length > 0 && allSuppleirs.map( supplier => (
                    <ShowSuppliers key={supplier._id}
                    nameSupplier={supplier.nameSupplier} 
                    email={supplier.email} 
                    tel={supplier.tel} 
                    dispatch={dispatch} 
                    _id={supplier._id} />
                ))}
            </div>
        </div>
        
    )
};

const ShowSuppliers = props => {
    const { nameSupplier, tel, email, _id, dispatch } = props;
    const deleteSupplier = () => {
        dispatch(removeSupplier(_id))
    }
    return (
        <div className="show-suppliers">
            <span>{nameSupplier}</span>
            <span>{tel}</span>
            <span>{email}</span>
            <button onClick={deleteSupplier}>מחק ספק</button>
        </div>
    )
}