import { Alert, Typography } from "@mui/material"

export const SimpleAlert = props => {
    const { variant = "standard", severity="error", message} = props;

    const finalMessage = message?.data?.message ||
        message?.data ||
        message?.message ||
        message ||
         'הודעה שאינה תקינה'
    ;

    const containsHtml = (str) => {
        const pattern = /<\/?[a-z][\s\S]*>/i;
        return pattern.test(str);
    };

    const isHtmlMessage = containsHtml(finalMessage);

    return (
        <Alert variant={variant} severity={severity}>
            {
                isHtmlMessage ? 
                    <div dangerouslySetInnerHTML={{__html: finalMessage}} />
                :
                <Typography sx={{paddingRight: '5px'}}>
                    {finalMessage}
                </Typography>
            }
        </Alert>
    )
};

