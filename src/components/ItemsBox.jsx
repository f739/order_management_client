import { useState } from "react";
import { useDispatch } from 'react-redux';
import { createNewNote, removeNote, addOrSubtract } from "../dl/slices/products";

export const ItemsBox = props => {
    const dispatch = useDispatch()
    const { nameProduct, factory, temporaryQuantity, _id,
        category, unitOfMeasure, note, setWhichFactoryToSend } = props;

    const addItem = async () => {
        setWhichFactoryToSend(factory)
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
            <div className="start-order">
                <h4>{nameProduct}</h4>
                <span>{unitOfMeasure}</span>
                <span>{category}</span>
                <span className={`factory-${factory}`}>{factory && factory.charAt(0).toUpperCase()}</span>
            </div>
            <ShowNote note={note} _id={_id} dispatch={dispatch} />
            <div className="quantity-controls end-order">
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
            <div className="note center-order">
                <label>
                    הוסף הערה:
                </label>
                <input onChange={e => setNewNote(e.target.value)} className="input-note" value={newNote}/>
                <button onClick={sendNewNote} className="send-note">שלח</button>
            </ div>
        )
    }else {
        return (
            <div className="note center-order">
                <label>
                    הערה להזמנה:
                </label>
                <span className="show-note">{note}</span>
                <button onClick={deleteNote} className="delete-note">מחק הערה</button>
            </div>
        )
    }
   
}