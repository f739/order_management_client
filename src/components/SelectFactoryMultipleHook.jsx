import {Select, Chip, FormControl, MenuItem, InputLabel, Box} from '@mui/material';
import { useGetBranchesQuery } from '../dl/api/branchesApi';
import { LoudingPage } from './indexComponents';

export const SelectFactoryMultipleHook = ({set, form, showAllFactoryLine=false}) => {
    const { data: allBranches, error: errorGetBranches, isLoading: isLoadingGetBranches } = useGetBranchesQuery();

    const handleChange = event => {
        const { target: { value } } = event;
        set(value)
    };

    const getLabel = idBranch => {
        const allBranch = allBranches.find( br => br._id === idBranch);
        return allBranch.nameBranch;
    }
    
    if (isLoadingGetBranches) return <LoudingPage /> 
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
          value={form.branches}
          onChange={handleChange}
          renderValue={ selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map( branch => (
                    <Chip key={branch} label={getLabel(branch)} />
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
            {allBranches.length > 0 && allBranches.map( branch => (
                <MenuItem key={branch._id} value={branch._id} >
                    {branch.nameBranch}
                </MenuItem>
            )) }
        </Select>
      </FormControl>
      
    )
}