import {Select, Chip, FormControl, MenuItem, InputLabel, Box} from '@mui/material';

export const SelectFactoryMultipleHook = ({set, form, showAllFactoryLine=false}) => {

    const handleChange = event => {
        const { target: { value } } = event;
        set(value)
    };
    const factories = ['קייטרינג', 'חצור', 'מאפיה']
  
    return (
        <FormControl variant="filled" sx={{ m: 1, width: '100%' }}>
        <InputLabel id="demo-simple-select-filled-label" sx={{ right: 25, transformOrigin: 'top right' }}>
            סניפים
        </InputLabel>
        <Select
        labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          label="סניפים"
          multiple
          value={form.factories}
          onChange={handleChange}
          renderValue={ selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map( value => (
                    <Chip key={value} label={value} />
                ))}
            </Box>
          )}
          sx={{
            '& .MuiSelect-icon': {
                right: 'unset',
                left: 7,
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
            {factories.map( (factory, i) => (
                <MenuItem key={i} value={factory} >
                    {factory}
                </MenuItem>
            ))}
        </Select>
      </FormControl>
      
    )
}