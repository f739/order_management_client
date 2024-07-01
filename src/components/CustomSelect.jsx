import { handleFormHook } from './HandleFormHook';
import { MenuItem,TextField } from '@mui/material';

export const CustomSelect = (
    {set, nameField, value='', label, options, optionsValue, optionsValueToShow=false, ifFunc=false, showAllFactoryLine=false }
    ) => {
        
    return (
        <TextField
        id="filled-select-currency"
        name={nameField}
        value={value}
        onChange={e => handleFormHook(e.target, set, ifFunc)}
        select
        fullWidth
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
        { showAllFactoryLine && 
        <MenuItem value="allFactories">
            כל המפעלים
        </MenuItem>
        }
        {options && options.length > 0 && options.map( item => (
            <MenuItem key={item._id} value={optionsValueToShow ? item[optionsValueToShow] : item[optionsValue]}>
                {item[optionsValue]}
            </MenuItem>
        ))}
    </TextField>
    )
}