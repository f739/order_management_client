import FaceIcon from '@mui/icons-material/Face';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Chip, Stack } from "@mui/material";

export const StackChips = ({branch=null, name=null, catgory=false }) => {
    return (
        <>
            <Stack direction="row">
               { branch && <Chip variant="outlined" color="primary"
                size="small"
                icon={<FactoryOutlinedIcon fontSize="small" />} 
                label={branch.nameBranch} 
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