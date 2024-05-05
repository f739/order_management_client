import { useEffect } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { getAllErrorsLog, clearLogger } from '../dl/slices/logger.js';
import moment from 'moment';
import '../css/logger.css';

export const Logger = () => {
    const dispatch = useDispatch();
    const {allLogger, isLoading} = useSelector( state => state.logger);
    useEffect( () => {
        if (allLogger.length === 0) {
            dispatch( getAllErrorsLog())
        }
    },[])
    if (isLoading) return <h1>🌀 Loading...</h1>;
    return (
        <>
        <button onClick={ () => dispatch( clearLogger())}>ניקוי הלוג</button>
           <table className="logger-table">
                <thead>
                    <tr>
                    <th>Level</th>
                    <th>Message</th>
                    <th>Action Page</th>
                    <th>Additional Info</th>
                    <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {allLogger && allLogger.length > 0 ? (
                    allLogger.map((log, index) => (
                    <tr key={index}>
                        <td className={`level-${log.level.toLowerCase()}`}>{log.level}</td>
                        <td>{log.message}</td>
                        <td>{log.actionPage}</td>
                        <td>{log.additionalInfo}</td>
                        <td>{moment(log.timestamp).format('YYYY-MM-DD HH:mm')}</td>
                    </tr>
                    ))) : (
                        <tr><td colSpan="5">אין שגיאות להצגה</td></tr>
                    )}
                </tbody>
            </table>
        </>
    )
} 