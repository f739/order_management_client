import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledPaper = styled(Box)(({ theme, active }) => ({
    padding: theme.spacing(1),
    backgroundColor: active === 'false' ? theme.palette.grey[200] : theme.palette.background.default,
    // paddingTop: '5px',
    // paddingRight: '5px',
    // paddingBottom: '5px',
    // paddingLeft: '19px',
    margin: theme.spacing(0.2, 0),
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(0.999)',
      boxShadow: theme.shadows[2],
    },
}));