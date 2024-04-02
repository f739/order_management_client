import { useState } from "react";
import { useDispatch } from 'react-redux';
import { createNewNote, removeNote, addOrSubtract } from "../dl/slices/products";
import save from '../assetes/save.svg';
import trash_icon from '../assetes/trash_icon.svg';

export const ItemsBox = props => {
    const dispatch = useDispatch()
    const { nameProduct, factory, temporaryQuantity, _id,
        category, unitOfMeasure, note } = props;

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
            <div className="start-order">
                <span className={`factory-${factory}`}>{factory && factory.charAt(0).toUpperCase()}</span>
                <span><strong>{nameProduct}</strong></span>
                <span>{unitOfMeasure}</span>
                <span>{category}</span>
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
                <input onChange={e => setNewNote(e.target.value)} className="input-note" value={newNote}/>
                <button onClick={sendNewNote} className="send-note">
                    <img src={save} alt="שמור" className="icon" />
                </button>
            </ div>
        )
    }else {
        return (
            <div className="note center-order">
                <span className="show-note">{note}</span>
                <button onClick={deleteNote} className="delete-note">
                    <img src={trash_icon} alt="מחק הערה" className="icon" />
                </button>
            </div>
        )
    }
   
}