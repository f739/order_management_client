import { Button, CircularProgress } from "@mui/material"


export const ButtonConfirm = props => {
    const { confirmAction, confirmLabel, isLouding } = props;
    return (
        <Button onClick={confirmAction} color="primary" variant="contained" disabled={isLouding}>
            {isLouding ? <CircularProgress size={24} /> : confirmLabel}
        </Button>
    )
};
