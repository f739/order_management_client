import { useState } from "react";
import { URL } from "../services/service";
import $ from 'axios';

export const ItemsBox = props => {
    const { nameProduct, quantity, id, setNewQuantity } = props;
    const addItem = async () => {
        try {
            const res = await $.put(`${URL}/products/${Number(quantity) + 1}/${id}/changeQuantity`);
            setNewQuantity(res.data.newQuantity)
        }catch (err) {
            console.log(err);
        }
    }
    const removeItem = async () => {
        if (quantity > 0) {
            const res = await $.put(`${URL}/products/${Number(quantity) - 1}/${id}/changeQuantity`);
            setNewQuantity(res.data.newQuantity)
        }
    }
    return (
        <>
            <h1>{nameProduct}</h1>
            <button onClick={addItem}>+</button>
            <span>{quantity}</span>
            <button onClick={removeItem}>-</button>
        </>
    )
}