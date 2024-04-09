import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { NoEntry } from "./noEntry";
import { sendProductReport } from "../dl/slices/issuingReports";
import { SelectSuppliersHook } from "../components/SelectSuppliersHook";
import { SelectProductsHook } from "../components/selectProductsHook";
import { SelectFactoryHook } from "../components/SelectFactoryHook";
import { handleFormHook } from "../components/HandleFormHook";


export const IssuingReports = () => {
    const dispatch = useDispatch()
    const [formToDeliver, setFormToDeliver] = useState(
        {_idSupplier: '', skuProduct: '', dateStart: '', dateEnd: '', factory: '' });
    const {license} = useSelector( state => state.users.user);
    const SendProductReport = () => {
        dispatch( sendProductReport(formToDeliver))
    }

    return (
        <>
            { license === 'Bookkeeping' || license === 'purchasingManager' ? 
            <div className="container-Bookkeeping">
                <div className="report">
                    <label>דו"ח מוצר</label>
                    <SelectProductsHook set={setFormToDeliver} form={formToDeliver} />
                    <SelectSuppliersHook set={setFormToDeliver} form={formToDeliver} />
                    <SelectFactoryHook set={setFormToDeliver} form={formToDeliver} showAllFactoryLine={true} />
                    <input type="date" name="dateStart" onChange={ e => handleFormHook( e.target, setFormToDeliver)} />
                    <input type="date" name="dateEnd" onChange={ e => handleFormHook( e.target, setFormToDeliver)} />
                    <button onClick={SendProductReport}>שלח</button>
                </div>
                
            </div>
            : <NoEntry />
            }
        </>
    )
}