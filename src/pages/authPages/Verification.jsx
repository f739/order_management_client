
import { useVerificationEmailAutoQuery } from "../../dl/api/authApi"
import { ErrorPage } from '../../components/ErrorPage';
import { Navigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";

export const Verification = () => {
    const { email, isUser } = useParams();

    const {
        isLoading,
        error,
        isSuccess
    } = useVerificationEmailAutoQuery({email, isUser});

    const navigateUser = '../../companySettings/userDetails';
    const navigateCompany = '../../companySettings/companyDetails';

    if (error) return <ErrorPage error={error} />
    if (isLoading) return <Typography variant="h3">האימות נשלח...</Typography>
    if (isSuccess) return <Navigate to={isUser ? navigateUser : navigateCompany} />
    return null
};
