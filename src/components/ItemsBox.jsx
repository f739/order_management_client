import { useState } from "react";
import { URL } from "../services/service";
import $ from 'axios';

export const ItemsBox = props => {
    const { nameProduct, temporaryQuantity, id, setNewQuantity, category, unitOfMeasure } = props;
    const [createNewNote, setCreateNewNote] = useState('');

    const addItem = async () => {
        try {
            const res = await $.put(`${URL}/orders/${Number(temporaryQuantity) + 1}/${id}/changeQuantity`);
            setNewQuantity(res.data.newQuantity)
        }catch (err) {
            console.log(err);
        }
    }
    const removeItem = async () => {
        if (temporaryQuantity > 0) {
            const res = await $.put(`${URL}/orders/${Number(temporaryQuantity) - 1}/${id}/changeQuantity`);
            setNewQuantity(res.data.newQuantity)
        }
    }
    const sendNewNote = async () => {
        try {
            const res = await $.put(`${URL}/orders/${id}/${createNewNote}/createNewNote`);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="box-product-from-the-order">
            <h1>{nameProduct}</h1>
            <span>{category}</span>
            <span>{unitOfMeasure}</span>
            <label>
                הוסף הערה:
                <input onChange={e => setCreateNewNote(e.target.value)} value={createNewNote}/>
                <button onClick={sendNewNote}>שלח</button>
            </label>
            <div className="quantity-controls">
                <button onClick={addItem}>+</button>
                <span>{temporaryQuantity}</span>
                <button onClick={removeItem}>-</button>
            </div>
        </div>
    )
}