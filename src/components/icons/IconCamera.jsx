import { IconButton, Tooltip } from '@mui/material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';


export const IconCameraButton = props => {
    const { action, title } = props;
    return (
        <Tooltip disableFocusListener disableTouchListener title={title}>
            <IconButton
                onClick={e => action(e)}
            >
                <CameraAltIcon fontSize='mediume' />
            </IconButton>
        </Tooltip>
    )
} 
