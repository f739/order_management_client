import * as React from 'react';
import { useState } from 'react';
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

export const InputNumberPrice  = ({value, setValue}) => {
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
    <TooltipComponent title={'שנה מחיר בהזמנה זו'} open={open} handleTooltipClose={handleTooltipClose}>
      <FormControl variant="standard">
        <TextField 
          variant="standard"
          label='מחיר'
          value={value}
          onChange={handleChange}
          name="numberformat"
          InputProps={{
            startAdornment: <InputAdornment position="start">₪</InputAdornment>,
            inputComponent: NumericFormatCustom,
          }}
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
          sx={{
              '& .MuiInputBase-input': {
                padding: '3px 2px', 
              },
            }}
        />
      </FormControl>
    </TooltipComponent>
  );
};
export const InputNumberQuantity = ({value, setValue}) => {
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
    <TooltipComponent title={'שנה כמות מהמוצר'} open={open} handleTooltipClose={handleTooltipClose}>
      <FormControl variant="standard">
        <TextField
          label='כמות'
          value={value}
          onChange={handleChange}
          name="numberformat"
          InputProps={{inputComponent: NumericFormatCustom}}
          variant="standard"
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
          sx={{
              '& .MuiInputBase-input': {
                padding: '3px 2px', 
                minWidth: '40px',
                maxWidth: '50px'
              },
            }}
        />
      </FormControl>
    </TooltipComponent>
  );
};


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
