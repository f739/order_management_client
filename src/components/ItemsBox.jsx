import { useState } from "react";
import { URL } from "../services/service";
import { toast } from 'react-toastify';
import $ from 'axios';

export const ItemsBox = props => {
    const { nameProduct, temporaryQuantity, id, setNewQuantity, category, unitOfMeasure, note } = props;

    const addItem = async () => {
        try {
            const res = await $.put(`${URL}/orders/${Number(temporaryQuantity) + 1}/${id}/changeQuantity`);
            setNewQuantity(res.data.newQuantity)
        }catch (err) {
            toast.error(err.response.data.message);
        }
    }
    const removeItem = async () => {
        if (temporaryQuantity > 0) {
            const res = await $.put(`${URL}/orders/${Number(temporaryQuantity) - 1}/${id}/changeQuantity`);
            setNewQuantity(res.data.newQuantity)
        }
    }
    return (
        <div className="box-product-from-the-order">
            <h1>{nameProduct}</h1>
            <span>{category}</span>
            <span>{unitOfMeasure}</span>
            <ShowNote note={note} id={id} className="note" />
            <div className="quantity-controls">
                <button onClick={addItem}>+</button>
                <span>{temporaryQuantity}</span>
                <button onClick={removeItem}>-</button>
            </div>
        </div>
    )
}

const ShowNote = props => {
    const { note, id } = props;
    const [createNewNote, setCreateNewNote] = useState('');
    const sendNewNote = async () => {
        try {
            const res = await $.put(`${URL}/orders/${id}/${createNewNote}/createNewNote`);
            toast.success(res.data.message);
        }catch (err) {
            console.log(err.response);
            toast.error(err.response.data.message);
        }
    }
    const deleteNote = async () => {
        try {
            const res = await $.delete(`${URL}/orders/${id}/deleteNote`);
            toast.success(res.data.message);
        }catch (err) {
            toast.error(err.response.data.message);
        }
    }
    if (!note) {
        return (
            <label>
                הוסף הערה:
                <input onChange={e => setCreateNewNote(e.target.value)} value={createNewNote}/>
                <button onClick={sendNewNote}>שלח</button>
            </label>
        )
    }else {
        return (
            <>
                <span>{note}</span>
                <button onClick={deleteNote}>מחק הערה</button>
            </>
        )
    }
   
}