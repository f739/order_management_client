import { Tooltip, ClickAwayListener } from '@mui/material';

export const TooltipComponent = ({title, children, open, handleTooltipClose}) => {

    return (
        <>
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip 
                    PopperProps={{
                    disablePortal: true,
                    }}
                    title={title} open={open} onClose={handleTooltipClose}>
                        {children}
                </Tooltip>
            </ClickAwayListener>
        </>
    )

}