import { useState } from "react";
import { useDispatch } from 'react-redux';
import { createNewNote, removeNote, addOrSubtract } from "../dl/slices/products";

export const ItemsBox = props => {
    const dispatch = useDispatch()
    const { nameProduct, temporaryQuantity, _id, category, unitOfMeasure, note } = props;

    const addItem = async () => {
        const newTemporaryQuantity = Number(temporaryQuantity) +1 ;
        dispatch( addOrSubtract({_id, newTemporaryQuantity}))
    }
    const removeItem = async () => {
        if (temporaryQuantity > 0) {
            const newTemporaryQuantity = Number(temporaryQuantity) -1 ;
            dispatch( addOrSubtract({_id, newTemporaryQuantity}))
        }
    }
    return (
        <div className="box-product-from-the-order">
            <h1>{nameProduct}</h1>
            <span>{category}</span>
            <span>{unitOfMeasure}</span>
            <ShowNote note={note} _id={_id} dispatch={dispatch} className="note" />
            <div className="quantity-controls">
                <button onClick={addItem}>+</button>
                <span>{temporaryQuantity}</span>
                <button onClick={removeItem}>-</button>
            </div>
        </div>
    )
}

const ShowNote = props => {
    const { note, _id, dispatch } = props;
    const [newNote, setNewNote] = useState('');
    const sendNewNote = () => {
        if (newNote !== '') {
            dispatch( createNewNote({_id, newNote}))
        }
    }
    const deleteNote = () => {
        dispatch( removeNote(_id));
        setNewNote('')
    }
    if (!note) {
        return (
            <label>
                הוסף הערה:
                <input onChange={e => setNewNote(e.target.value)} value={newNote}/>
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