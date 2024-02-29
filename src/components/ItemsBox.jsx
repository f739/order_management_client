import { useState } from "react";
import { URL } from "../services/service";
import $ from 'axios';

export const ItemsBox = props => {
    const { nameProduct, temporaryQuantity, id, setNewQuantity } = props;
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
    return (
        <div className="box-product-from-the-order">
            <h1>{nameProduct}</h1>
            <button onClick={addItem}>+</button>
            <span>{temporaryQuantity}</span>
            <button onClick={removeItem}>-</button>
        </div>
    )
}