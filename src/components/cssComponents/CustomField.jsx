import { TextField } from "@mui/material";

export const CustomField = ({ id, name, value, label, onChange, type = "text", disabled=false, children }) => (
  <TextField
    id={id}
    type={type}
    name={name}
    value={value}
    label={label}
    onChange={onChange}
    disabled={disabled}
    multiline
    fullWidth
    variant="filled"
    sx={{
        '& label': {
        right: 25,
        transformOrigin: 'top right',
        },
    }}
  >
    {children}
  </TextField>
);
