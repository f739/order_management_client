import { useEffect, useState } from "react";
import { URL } from "../services/service";
import { toast } from "react-toastify";
import { handleFormHook } from "./HandleFormHook";
import $ from 'axios';
import '../css/suppliers.css'
export const Supplier = () => {
    const [newsupplier, setNewsupplier] = useState({nameSupplier: '', tel: '', email: ''});
    const [allSuppleirs, setAllSuppliers] = useState([]);

    useEffect( () => {
        const getSuppliers = async () => {
            try {
                const res = await $.get(`${URL}/suppliers/getAllSuppliers`);
                setAllSuppliers(res.data.allSuppliers)
            }catch (err) {
                toast.error(err.response.data.message);
            }
        }; getSuppliers();
    },[]);

    const handleSaveNewSupplier  = async () => {
        try {
            const res = await $.post(`${URL}/suppliers/newSupplier`, newsupplier);
            toast.success(res.data.message,{autoClose: 2000, hideProgressBar: true,});
        }catch (err) {
            toast.error(err.response.data.message);
        }
    }
    return (
        <div className="suppliers">
            <div className="new-supplier">
                <label>
                    שם ספק:
                    <input type="text" name="nameSupplier" onChange={e => handleFormHook(e.target, setNewsupplier)}/> 
                </label>
                <label>
                    פלאפון ספק:
                <input type="tel" name="tel" onChange={e => handleFormHook(e.target, setNewsupplier)}/> 
                </label>
                <label>
                    אמייל ספק:
                <input type="email" name="email" onChange={e => handleFormHook(e.target, setNewsupplier)}/> 
                </label>
                <button onClick={handleSaveNewSupplier}>שמור ספק חדש</button>
            </div>
            <div className="show-supplier">
                <h1 className="title">ספקים קיימים:</h1>
                {allSuppleirs && allSuppleirs.map( supplier => (
                    <ShowSuppliers key={supplier._id}
                    nameSupplier={supplier.nameSupplier} 
                    email={supplier.email} 
                    tel={supplier.tel} 
                    id={supplier._id} />
                ))}
            </div>
        </div>
        
    )
};

const ShowSuppliers = props => {
    const { nameSupplier, tel, email, id } = props;
    const deleteSupplier = async () => {
        try {
            const res = await $.delete(`${URL}/suppliers/${id}/deleteSupplier`);
            toast.success(res.data.message);
        }catch (err) {
            toast.error(err.response.data.message);
        }
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