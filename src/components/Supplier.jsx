import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getSuppliers, createNewSupplier, removeSupplier, editSupplier } from "../dl/slices/suppliers";
import { handleFormHook } from "./HandleFormHook";
import { EditItemHook } from "./EditItemHook";
import edit from '../assetes/edit.svg';

export const Supplier = () => {
    const dispatch = useDispatch();
    const [newSupplier, setNewSupplier] = useState({nameSupplier: '', tel: '', email: '', supplierNumber: ''});

    const handleSaveNewSupplier  = async () => {
        dispatch( createNewSupplier(newSupplier));
        setNewSupplier({nameSupplier: '', tel: '', email: '', supplierNumber: ''})
    }
    return (
        <div className="suppliers">
            <div className="new-item">
                <label>שם ספק:</label>
                <input type="text" name="nameSupplier" value={newSupplier.nameSupplier} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 

                <label>פלאפון ספק:</label>
                <input type="tel" name="tel" value={newSupplier.tel} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 
                
                <label>אמייל ספק:</label>
                <input type="email" name="email" value={newSupplier.email} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 

                <label>מספר ספק:</label>
                <input type="text" name="supplierNumber" value={newSupplier.supplierNumber} onChange={e => handleFormHook(e.target, setNewSupplier)}/> 
                <button onClick={handleSaveNewSupplier}>שמור ספק חדש</button>
            </div>
            <ShowSuppliers dispatch={dispatch} />
        </div>
        
    )
};

const ShowSuppliers = props => {
    const { dispatch } = props;
    const {allSuppliers, isLoading} = useSelector( state => state.suppliers);
    const [showEditSupplier, setShowEditSupplier] = useState(false);
    const fields = [
        {name: 'nameSupplier',label: 'שם ספק',typeInput: 'text', type: 'input'},
        {name: 'tel',label: 'פלאפון ספק',typeInput: 'tel', type: 'input'},
        {name: 'email',label: 'אימייל ספק',typeInput: 'email', type: 'input'},
        {name: 'supplierNumber',label: 'מספר ספק',typeInput: 'text', type: 'input'}
      ];      
    useEffect(() => {
        if (!allSuppliers.length) {
            dispatch(getSuppliers());
        }
    }, [dispatch]);
    const deleteSupplier = _id => {
        dispatch(removeSupplier(_id));
        setShowEditSupplier(false);
    }
    const handleEditItem = supplierUpdated => {
        dispatch( editSupplier(supplierUpdated));
        setShowEditSupplier(false);

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
                    <button onClick={() => setShowEditSupplier(supplier)}>
                        <img src={edit} alt="ערוך" className='icon'/>
                    </button>
                    { showEditSupplier._id === supplier._id && 
                        <EditItemHook initialData={showEditSupplier} 
                        onSubmit={handleEditItem}
                        fields={fields}
                        setShowEdit={setShowEditSupplier}
                        deleteItem={deleteSupplier}
                        />
                    }
                </div>
            )) ) : (<div>אין ספקים להצגה</div>)}
        </div>
    )
}