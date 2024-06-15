import FaceIcon from '@mui/icons-material/Face';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Chip, Stack } from "@mui/material";

export const StackChips = ({factory=null, name=null, catgory=false }) => {
    return (
        <>
            <Stack direction="row">
               { factory && <Chip variant="outlined" color="primary"
                size="small"
                icon={<FactoryOutlinedIcon fontSize="small" />} 
                label={factory} 
                sx={{ p: 1, fontSize: '0.8rem', mx: 0.2 }}
                />}
               { name && <Chip variant="outlined" color="secondary"
                size="small"
                icon={<FaceIcon fontSize="small" />} 
                label={name} 
                sx={{p: 1, mx: 0.2}}
                />}
               { catgory && <Chip variant="outlined" color="secondary"
                size="small"
                icon={<CategoryOutlinedIcon fontSize="small" />} 
                label={catgory} 
                sx={{p: 1, mx: 0.2}}
                />}
            </Stack>
        </>
    )
} 