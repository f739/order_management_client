import { useState } from "react";
import { URL } from "../services/service";
import $ from 'axios';

export const NewSupplier = () => {
    const [newsupplier, setNewsupplier] = useState({nameSupplier: '', tel: '', email: ''});

    const handleFormNewSupplier = ({target}) => {
        const { value, name } = target;
        console.log(name , value);
        setNewsupplier( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    const handleSaveNewSupplier  = async () => {
        try {
            const res = await $.post(`${URL}/suppliers/newSupplier`, newsupplier);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="new-supplier">
            <label>
                שם ספק:
                <input type="text" name="nameSupplier" onChange={handleFormNewSupplier}/> 
            </label>
            <label>
                פלאפון ספק:
               <input type="tel" name="tel" onChange={handleFormNewSupplier}/> 
            </label>
            <label>
                אמייל ספק:
               <input type="email" name="email" onChange={handleFormNewSupplier}/> 
            </label>
            <button onClick={handleSaveNewSupplier}>שמור ספק חדש</button>
        </div>
    )
};