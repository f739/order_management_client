import { TextField } from "@mui/material";

export const CustomField = ({ id, name, value, label, onChange,
   type = "text", disabled=false, required = false, variant = "filled", children }) => (
  <TextField
    id={id}
    type={type}
    name={name}
    value={value}
    label={label}
    required={required}
    onChange={onChange}
    disabled={disabled}
    multiline={type === 'textarea'}
    fullWidth
    margin="normal"
    variant={variant}
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