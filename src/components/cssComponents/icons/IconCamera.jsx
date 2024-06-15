import {  IconButton, Tooltip } from '@mui/material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';


export const IconCameraButton = props => {
const {action, title} = props;
    return (
        <Tooltip disableFocusListener disableTouchListener title={title}>
            <IconButton onClick={e => action(e)} sx={{
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px', 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
                padding: '8px', 
                color: '#BA68C8', 
                '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                }
            }}>
            <CameraAltIcon fontSize='mediume' />
            </IconButton>
        </Tooltip>
    )
} 
