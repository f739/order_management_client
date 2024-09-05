import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, TextField } from '@mui/material';
import { TooltipComponent } from './TooltipComponent';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
    />
  );
});


export const InputNumberPrice = ({ value, setValue }) => {
  const [open, setOpen] = useState(false);
  
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    setValue(event);
  };

  return (
    <TextField 
      variant="standard"
      value={value}
      onChange={handleChange}
      name="numberformat"
      InputProps={{
        startAdornment: <InputAdornment position="start">₪</InputAdornment>,
        inputComponent: NumericFormatCustom,
        disableUnderline: false,
      }}
      onMouseEnter={handleTooltipOpen}
      onMouseLeave={handleTooltipClose}
      sx={{
        '& .MuiInputBase-root': {
          '&:before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused:after': {
            borderBottom: '2px solid #1976d2',
          },
        },
        '& .MuiInputBase-input': {
          padding: '3px 2px',
        },
        '& .MuiFormLabel-root': {
          display: 'none',
        },
      }}
    />
  );
};


export const InputNumberQuantity = ({ value, setValue }) => {
  const [open, setOpen] = useState(false);
  
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleChange = event => {
    setValue(event);
  };

  return (
    <TextField
      variant="standard"
      value={value}
      onChange={handleChange}
      name="numberformat"
      InputProps={{
        inputComponent: NumericFormatCustom,
        disableUnderline: false,
      }}
      onMouseEnter={handleTooltipOpen}
      onMouseLeave={handleTooltipClose}
      sx={{
        '& .MuiInputBase-root': {
          '&:before': {
            borderBottom: 'none',
            paddingBottom: '0px',
            paddingTop: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            fontSize: ''
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused:after': {
            borderBottom: '2px solid #1976d2',
          },
        },
        '& .MuiInputBase-input': {
          padding: '0px',
          fontSize: '14px',
        },
        '& .MuiFormLabel-root': {
          display: 'none',
        },
      }}
    />
  );
};
// !smallSize ? {
//   '& .MuiInputBase-root': {
//     '&:before': {
//       borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
//     },
//     '&:hover:not(.Mui-disabled):before': {
//       borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
//     },
//     '&.Mui-focused:after': {
//       borderBottom: '2px solid #1976d2',
//     },
//   },
//   '& .MuiInputBase-input': {
//     padding: '3px 2px',
//   },
//   '& .MuiFormLabel-root': {
//     display: 'none',
//   },
// } :

export const ChangeQuantity = props => {
  const { quantity, action, title } = props;

  const [open, setOpen] = useState(false);
  
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <TooltipComponent title={title} open={open} handleTooltipClose={handleTooltipClose}>
      <TextField 
          value={quantity}
          onChange={action}
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
          size="small"
          inputProps={{ min: 0, style: { textAlign: 'center', width: '60px' } }}
          variant="outlined"
      />
    </TooltipComponent>
  )
}
