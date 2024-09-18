import React from 'react';
import { Alert, Button, Box } from "@mui/material";

export const SimpleAlert = props => {
    const { variant = "standard", severity = "error", message, action } = props;

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
            sx={{ 
                '& .MuiAlert-message': { 
                    width: '100%',
                    '& > div': {
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 1,
                    }
                },
                '& .MuiButton-root': {
                    padding: '4px 8px',
                    minWidth: 'auto',
                    marginTop: { xs: 1, sm: 0 },
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                    textTransform: 'none',
                }
            }}
        >
            <Box>
                {isHtmlMessage ? (
                    <div dangerouslySetInnerHTML={{ __html: finalMessage }} />
                ) : (
                    finalMessage
                )}
                {action && (
                    <Button 
                        onClick={typeof action === 'function' ? action : undefined}
                        variant="outlined"
                        size="small"
                    >
                        מחירים
                    </Button>
                )}
            </Box>
        </Alert>
    );
};