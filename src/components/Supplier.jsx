import { useEffect, useState } from "react";
import { handleFormHook } from "./HandleFormHook";
import { validEmail, fieldsAreNotEmpty } from "./hooks/fanksHook";
import { EditItemHook } from "./EditItemHook";
import { useGetSuppliersQuery,
    useCreateNewSupplierMutation,
    useRemoveSupplierMutation,
    useEditSupplierMutation } from '../dl/api/suppliersApi';
import edit from '../assetes/edit.svg';

export const Supplier = () => {
    const [message, setMessage] = useState('')
    const [newSupplier, setNewSupplier] = useState({nameSupplier: '', tel: '', email: '', supplierNumber: ''});
    const [createNewSupplier, { error, isLoading }] = useCreateNewSupplierMutation();

    useEffect(() => {
        if (error) {
            setMessage(error.data?.message || 'An error occurred');
        }
    }, [error]);

    const handleSaveNewSupplier  = async () => {
        if (!fieldsAreNotEmpty(newSupplier)) {
            setMessage('חסר פרטים הכרחיים בטופס')
        }
        else if (!validEmail(newSupplier.email)) {
            setMessage('האימייל אינו תקני') 
        } 
        else {
            try {
                await createNewSupplier(newSupplier).unwrap();
                setNewSupplier({nameSupplier: '', tel: '', email: '', supplierNumber: ''})
                setMessage('')
            }catch (err) {return}
        }
        
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
                <span>{message}</span>
                {isLoading && <span>🌀</span>}
            </div>
            <ShowSuppliers />
        </div>
        
    )
};

const ShowSuppliers = () => {
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();
    const [removeSupplier, { error: errorRemoveSupplier }] = useRemoveSupplierMutation();
    const [editSupplier, { error: errorEditSupplier }] = useEditSupplierMutation();
    const [showEditSupplier, setShowEditSupplier] = useState(false);

    const fields = [
        {name: 'nameSupplier',label: 'שם ספק',typeInput: 'text', type: 'input'},
        {name: 'tel',label: 'פלאפון ספק',typeInput: 'tel', type: 'input'},
        {name: 'email',label: 'אימייל ספק',typeInput: 'email', type: 'input'},
        {name: 'supplierNumber',label: 'מספר ספק',typeInput: 'text', type: 'input'}
      ];     

    const deleteSupplier = async _id => {
        try {
            await removeSupplier(_id).unwrap();
            setShowEditSupplier(false);
        }catch (err) {
            console.log(err);
            console.log(errorRemoveSupplier);
        }
    }
    const handleEditItem = async supplierUpdated => {
        await editSupplier(supplierUpdated);
        setShowEditSupplier(false);
    }
    if (errorGetsuppliers) return <h3>ERROR: {errorGetsuppliers.error}</h3>
    if (isLoadingGetsuppliers) return <h1>🌀 Loading...</h1>;
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