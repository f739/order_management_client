import { Box, Container, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

export const ErrorPage = props => {
    const { error } = props;
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                <Typography component="h1" variant="h5" align="center">
                    שגיאה מספר {error.status}
                </Typography>
                <Box sx={{mt: 3}}>
                    <Typography variant="h6" align="center">
                        הודעה: {error?.data?.message}
                    </Typography>
                    <MuiLink 
                        component={RouterLink} 
                        to="../reportAnError" 
                        variant="body2" 
                        sx={{ 
                            display: 'block', 
                            textAlign: 'center',
                            mt: 2 
                        }}
                    >
                        דווח על השגיאה
                    </MuiLink>
                </Box>
            </Paper>
        </Container>
    )
}