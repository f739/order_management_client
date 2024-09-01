import { TextField, InputAdornment } from "@mui/material";
import { useState } from "react";

export const CustomField = ({ id, name, value, initialValue = '', label, onChange,
   type = "text", disabled=false, required = false, variant = "filled", margin = "normal",
    children, icon }) => {

    const [localValue, setLocalValue] = useState(value || initialValue );
    
      const handleChange = (e) => {
        setLocalValue(e.target.value);
        onChange(e);
      };
    
      const handleBlur = () => {
        if (localValue === "") {
          setLocalValue(initialValue);
          onChange({ target: { name, value: initialValue } });
        }
      };

      return (
        <TextField
          id={id}
          type={type}
          name={name}
          value={localValue}
          label={label}
          required={required}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          multiline={type === 'textarea'}
          fullWidth
          margin={margin}
          variant={variant}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {icon}
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            sx: {
              right: variant === 'filled' ? 12 : 14,
              paddingRight: 2,
              left: 'unset',
              transformOrigin: 'top right',
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
                borderRightWidth: '1px !important',
                borderLeftWidth: '1px !important',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              textAlign: 'right',
            },
            '& .MuiInputLabel-root': {
              transformOrigin: 'top right !important',
              left: 'unset !important',
              right: variant === 'filled' ? '12px !important' : '14px !important',
              '&.MuiInputLabel-shrink': {
                transform: variant === 'filled' 
                  ? 'translate(12px, -10px) scale(0.75)' 
                  : 'translate(14px, -9px) scale(0.75)',
              },
            },
            ...(variant === 'filled' && {
              '& .MuiFilledInput-root': {
                paddingTop: '20px',
                '& input': {
                  paddingTop: '8px',
                },
              },
              '& .MuiInputLabel-root': {
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(12px, 4px) scale(0.75)',
                },
              },
            }),
          }}
        >
          {children}
        </TextField>
    );
  }