import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { addOrSubtract } from "../dl/slices/products";

export const ItemsBox = props => {
    const dispatch = useDispatch()
    const { nameProduct, factory, temporaryQuantity, _id,
        category, unitOfMeasure } = props;
    const [temporaryQuantityToShow, setTemporaryQuantityToShow] = useState(Number(temporaryQuantity))

    useEffect(() => {
        setTemporaryQuantityToShow(temporaryQuantity);
    }, [temporaryQuantity]);

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
    const editTemporaryQuantity = e => {
        const newValue = parseInt(e.target.value || e.target.innerText, 10);
        if (!isNaN(newValue)) {
            dispatch( addOrSubtract({_id, newTemporaryQuantity: newValue}))
        }
    }
    const changeTemporaryQuantity = e => {
        if (e.target.value !== '') {
            setTemporaryQuantityToShow(parseInt(e.target.value, 10))
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
            <div className="quantity-controls end-order">
                <button onClick={addItem}>+</button>
                <input type="number" 
                onChange={changeTemporaryQuantity}
                value={temporaryQuantityToShow}
                onBlur={editTemporaryQuantity} className="delete-defalt-style"/>
                <button onClick={removeItem}>-</button>
            </div>
        </div>
    )
}