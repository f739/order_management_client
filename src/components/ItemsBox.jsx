import { useState } from "react";

export const ItemsBox = props => {
    const { item, amount, setOrders } = props;

    const addItem = () => {
        setOrders(old => {
            return {
                ...old,
                [item]: old[item] + 1
            }
        })
    }
    const removeItem = () => {
        if (amount > 0) {
            setOrders(old => {
                return {
                    ...old,
                    [item]: old[item] - 1
                }
            })
        }
    }
    return (
        <>
            <h1>{item}</h1>
            <div>{amount}</div>
            <button onClick={addItem}>addItem</button>
            <button onClick={removeItem}>removeItem</button>
        </>
    )
}