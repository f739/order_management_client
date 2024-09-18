import React from 'react';
import { handleFormHook } from '../hooks/HandleFormHook';;
import {  MenuItem, TextField } from '@mui/material';

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const CustomSelect = (
    { set, disabled, nameField, value = '', label, options, optionsValue, optionsValueToShow = false, ifFunc = false, showAllFactoryLine = false }
) => {
    return (
        <TextField
            id="filled-select-currency"
            name={nameField}
            value={value}
            onChange={e => handleFormHook(e.target, set, ifFunc)}
            select
            fullWidth
            disabled={disabled}
            label={label}
            variant="filled"
            sx={{
                '& label': {
                    right: 25,
                    transformOrigin: 'top right',
                },
                '& .MuiSelect-icon': {
                    right: 'unset',
                    left: 7,
                },
                '& .MuiFormHelperText-root': {
                    textAlign: 'right',
                    width: '100%',
                },
                '& .css-d9oaum-MuiSelect-select-MuiInputBase-input-MuiFilledInput-input.css-d9oaum-MuiSelect-select-MuiInputBase-input-MuiFilledInput-input.css-d9oaum-MuiSelect-select-MuiInputBase-input-MuiFilledInput-input': {
                    paddingRight: 1.7,
                }
            }}
        >
            {showAllFactoryLine &&
                <MenuItem value="allFactories">
                    כל המפעלים
                </MenuItem>
            }
            {options && options.length > 0 && options.map(item => (
                <MenuItem
                    key={item._id}
                    disabled={!item.active}
                    value={optionsValueToShow ? getNestedValue(item, optionsValueToShow) : getNestedValue(item, optionsValue)}
                >
                    {getNestedValue(item, optionsValue)}
                </MenuItem>
            ))}
        </TextField>
    )
}

export const CustomSelectStandard = (
    { set, nameField, value = '', options, optionsValue, optionsValueToShow = false, ifFunc = false, showAllFactoryLine = false }
) => {

    return (
        <TextField
            name={nameField}
            value={value}
            onChange={e => handleFormHook(e.target, set, ifFunc)}
            select
            fullWidth
            variant="standard"
            sx={{ 
                '& .MuiInput-underline:before': {
                    borderBottom: 'none',
                },
                '& .MuiInput-underline:after': {
                    borderBottom: 'none',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottom: 'none',
                },  
            }}
        >
            {options && options.length > 0 ? options.map(item => (
                <MenuItem
                    key={item._id}
                    disabled={!item.active}
                    value={optionsValueToShow ? getNestedValue(item, optionsValueToShow) : getNestedValue(item, optionsValue)}
                >
                    {getNestedValue(item, optionsValue)}
                </MenuItem>
            )) : <MenuItem disabled>אין ספקים</MenuItem>}
        </TextField>
    )
}
