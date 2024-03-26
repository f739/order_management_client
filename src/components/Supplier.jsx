import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers, createNewSupplier, removeSupplier } from "../dl/slices/suppliers";
import { handleFormHook } from "./HandleFormHook";
import trash_icon from '../assetes/trash_icon.png';
import '../css/suppliers.css';

export const Supplier = () => {
    const dispatch = useDispatch();
    const [newSupplier, setNewSupplier] = useState({nameSupplier: '', tel: '', email: ''});

    const handleSaveNewSupplier  = async () => {
        dispatch( createNewSupplier(newSupplier));
        setNewSupplier({nameSupplier: '', tel: '', email: ''})
    }
    return (
        <div className="suppliers">
            <div className="new-item">
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
            <ShowSuppliers dispatch={dispatch} />
        </div>
        
    )
};

const ShowSuppliers = props => {
    const { dispatch } = props;
    const {allSuppliers, isLoading} = useSelector( state => state.suppliers);

    useEffect(() => {
        if (!allSuppliers.length) {
            dispatch(getSuppliers());
        }
    }, [dispatch]);
    const deleteSupplier = (_id) => {
        dispatch(removeSupplier(_id))
    }
    if (isLoading) return <h1>🌀 Loading...</h1>;

    return (
        <div className="show-items">
            <h1 className="title">ספקים קיימים:</h1>
            {allSuppliers && allSuppliers.length > 0 ? (
            allSuppliers.map( supplier => (
                <div key={supplier._id} className="show-item">
                    <span>{supplier.nameSupplier}</span>
                    <span>{supplier.tel}</span>
                    <span>{supplier.email}</span>
                    <button onClick={() => deleteSupplier(supplier._id)} className="delete-item">
                        <img src={trash_icon} alt="delete" />
                    </button>
                </div>
            )) ) : (<div>אין ספקים להצגה</div>)}
        </div>
    )
}