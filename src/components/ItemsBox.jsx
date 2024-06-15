import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addOrSubtract } from "../dl/slices/products";
import { actions } from "../dl/slices/orders";
import { Box, Grid, ListItemText, TextField, Button } from "@mui/material";
import { StackChips, IconRemoveButton, IconAddButton, ChangeQuantity } from "./indexComponents";

export const ItemsBox = props => {
    const dispatch = useDispatch()
    const { nameProduct, factory, _id, category, unitOfMeasure } = props;

    const productActive = useSelector( state => {
        return state.orders.cartToBookingManager.find( pr => pr._id === _id);
    });
    const { errorIncrease, errorChangeQuantity } = useSelector(state => state.orders.errorCartToBookingManager);
    
    const onIncrease = () => {
        dispatch( actions.increaseOne({_id, factory}))
    }
    const onDecrease = () => {
        dispatch( actions.decreaseOne(_id))
    }
    const onChangeQuantity = e => {
        const {value} = e.target;
        dispatch( actions.changeQuantityToBookingManager({quantity: value, _id, factory}))
    }
    
    return (    
        <Grid container spacing={1} alignItems="start" 
        textAlign='start' justifyContent='space-between' sx={{paddingLeft: '20px'}}>
            <Grid item xs={12}>   
                <StackChips factory={factory} catgory={category} />
            </Grid>
            <Grid item>
                <ListItemText primary={nameProduct} secondary={unitOfMeasure} />
            </Grid>
            <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconRemoveButton action={onDecrease} title={'הפחת כמות'} />
                    <ChangeQuantity 
                        action={onChangeQuantity} 
                        quantity={productActive?.quantity ?? 0} 
                        title={errorChangeQuantity ? errorChangeQuantity : 'שנה כמות'} />
                    <IconAddButton action={onIncrease} title={errorIncrease ? errorIncrease : 'הוסף כמות'} />
                </Box>
            </Grid>
        </Grid>
    )
}