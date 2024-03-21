import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getMeasures, createNewMeasure, removeMeasure } from "../dl/slices/measures";
import { handleFormHook } from './HandleFormHook';
import trash_icon from '../assetes/trash_icon.png';
import '../css/measure.css';

export const Measure = () => {
    const dispatch = useDispatch();
    const [newMeasure, setNewMeasure] = useState({measureName: ''});
    const allMeasures = useSelector( state => state.measures.allMeasures);
    const errorMessage = useSelector( state => state.measures.errorMessage);

    useEffect(() => {
        if (allMeasures.length === 0) {
            dispatch(getMeasures());
        }
    }, [dispatch]);

    const handleSaveNewMeasure  = async () => {
        dispatch( createNewMeasure(newMeasure));
        setNewMeasure({measureName: ''})
    }
    return (
        <div className="measure">
            <div className="new-item">
                <label>
                    שם יחידת מידה:
                    <input type="text" name="measureName" value={newMeasure.measureName} 
                    onChange={ e => handleFormHook(e.target, setNewMeasure)}/> 
                </label>
                <button onClick={handleSaveNewMeasure}>שמור יחידת מידה חדשה</button>
            </div>
            { errorMessage && <h4 className="error-message">{errorMessage}</h4>}
            <div className="show-items">
                <h1 className="title">יחידות מידה קיימות:</h1>
                {allMeasures.length > 0 && allMeasures.map( measure => (
                    <ShowMeasures key={measure._id}
                    measureName={measure.measureName}  
                    dispatch={dispatch}  
                    _id={measure._id} />
                ))}
            </div>
        </div>
        
    )
};

const ShowMeasures = props => {
    const { measureName, _id, dispatch } = props;
    const deleteMeasure = () => {
        dispatch(removeMeasure(_id))
    }
    return (
        <div className="show-item">
            <span>{measureName}</span>
            <button onClick={deleteMeasure} className="delete-item">
                <img src={trash_icon} alt="delete" />
            </button>
        </div>
    )
}