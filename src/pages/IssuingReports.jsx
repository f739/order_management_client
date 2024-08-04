import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from "react";
import { NoEntry } from "./authPages/noEntry";
import { sendProductReport, sendBookkeepingReport } from "../dl/slices/issuingReports";
// import { SelectSuppliersHook } from "../components/SelectSuppliersHook";
// import { SelectProductsHook } from "../components/selectProductsHook";
import { CustomSelect } from "../components/CustomSelect";
import { handleFormHook } from "../hooks/HandleFormHook";
import '../css/issuingReports.css';

export const IssuingReports = () => {
    const dispatch = useDispatch()
    const [formToDeliver, setFormToDeliver] = useState(
        { _idSupplier: '', skuProduct: '', dateStart: '', dateEnd: '', branch: '' });
    const { license, email } = useSelector(state => state.users.user);
    const [message, setMessage] = useState('');
    const [messageBookkeepingReport, setMessageBookkeepingReport] = useState('');

    const SendProductReport = async () => {
        if (formToDeliver.skuProduct === '') return setMessage('לא נבחר מוצר');
        try {
            const actionResult = await dispatch(sendProductReport({ ...formToDeliver, email }));
            const result = unwrapResult(actionResult);
            setMessage(result.message);
        } catch (error) {
            setMessage(error)
        }
    }
    const SendBookkeepingReport = async () => {
        try {
            const actionResult = await dispatch(sendBookkeepingReport(email));
            const result = unwrapResult(actionResult);
            setMessageBookkeepingReport(result.message);
        } catch (error) {
            setMessageBookkeepingReport(error);
        }
    }
    return (
        <>
            <div className="container-Bookkeeping">
                <div className="report">
                    <label>דו"ח מוצר</label>
                    <div className="line"></div>
                    <SelectProductsHook set={setFormToDeliver} form={formToDeliver} />
                    <SelectSuppliersHook set={setFormToDeliver} form={formToDeliver} />
                    <CustomSelect set={setFormToDeliver} form={formToDeliver} showAllFactoryLine={true} />
                    <div className="choose-date">
                        <input type="date" name="dateStart" onChange={e => handleFormHook(e.target, setFormToDeliver)} />
                        <input type="date" name="dateEnd" onChange={e => handleFormHook(e.target, setFormToDeliver)} />
                    </div>
                    <button onClick={SendProductReport} className="send-report" >שלח</button>
                    {message !== '' && <span className="message">{message}</span>}
                </div>
                <div className="report">
                    <label>דו"ח הנהלת חשבונות</label>
                    <div className="line"></div>
                    <button onClick={SendBookkeepingReport} className="send-report">שלח</button>
                    {messageBookkeepingReport !== '' && <span className="message">{messageBookkeepingReport}</span>}
                </div>

            </div>
        </>
    )
}