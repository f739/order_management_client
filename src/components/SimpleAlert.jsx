import { Alert } from "@mui/material"

export const SimpleAlert = props => {
    const { variant = "standard", severity = "error", message } = props;

    const finalMessage = message?.data?.message ||
        message?.data ||
        message?.message ||
        message ||
        'הודעה שאינה תקינה';

    const containsHtml = (str) => {
        const pattern = /<\/?[a-z][\s\S]*>/i;
        return pattern.test(str);
    };

    const isHtmlMessage = containsHtml(finalMessage);

    return (
        <Alert 
            variant={variant} 
            severity={severity}
            sx={{ '& .MuiAlert-message': { paddingRight: '5px' } }}
        >
            {isHtmlMessage ? (
                <div dangerouslySetInnerHTML={{ __html: finalMessage }} />
            ) : (
                finalMessage
            )}
        </Alert>
    )
};