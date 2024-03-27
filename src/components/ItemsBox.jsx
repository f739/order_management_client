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
            <h4>{nameProduct}</h4>
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
            <>
                <label>
                    הוסף הערה:
                </label>
                <input onChange={e => setNewNote(e.target.value)} className="input-note" value={newNote}/>
                <button onClick={sendNewNote} className="send-note">שלח</button>
            </>
        )
    }else {
        return (
            <>
                <label>
                    הערה להזמנה:
                </label>
                <span className="show-note">{note}</span>
                <button onClick={deleteNote} className="delete-note">מחק הערה</button>
            </>
        )
    }
   
}