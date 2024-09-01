import React, { useState, useEffect } from 'react';
import { Alert, Typography } from "@mui/material";

export const TimedAlert = (props) => {
    const { variant = "standard", severity = "error", message, duration = 5000 } = props;
    const [isVisible, setIsVisible] = useState(true);

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) {
        return null;
    }

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
    );
};