import { useSelector } from "react-redux";
import { NoEntry } from "./noEntry";

export const IssuingReports = () => {
    const {license} = useSelector( state => state.users.user);

    return (
        <>
            { license === 'Bookkeeping' || license === 'purchasingManager' ? 
            <>
                <h1>IssuingReports page</h1>
            </>
            : <NoEntry />
            }
        </>
    )
}