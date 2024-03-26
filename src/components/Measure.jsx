import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getMeasures, createNewMeasure, removeMeasure } from "../dl/slices/measures";
import { handleFormHook } from './HandleFormHook';
import trash_icon from '../assetes/trash_icon.png';
import '../css/measure.css';

export const Measure = () => {
    const dispatch = useDispatch();
    const [newMeasure, setNewMeasure] = useState({measureName: ''});

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
            <ShowMeasures  dispatch={dispatch} />
        </div>
        
    )
};

const ShowMeasures = props => {
    const { dispatch } = props;
    const {allMeasures, isLoading} = useSelector( state => state.measures);

    useEffect(() => {
        if (allMeasures.length === 0) {
            dispatch(getMeasures());
        }
    }, [dispatch]);

    const deleteMeasure = (_id) => {
        dispatch(removeMeasure(_id))
    }

    if (isLoading) return <h1>🌀 Loading...</h1>;
    return (
        <div className="show-items">
                <h1 className="title">יחידות מידה קיימות:</h1>
                {allMeasures && allMeasures.length > 0 ? (
                 allMeasures.map( measure => (
                    <div key={measure._id} className="show-item">
                        <span>{measure.measureName}</span>
                        <button onClick={() => deleteMeasure(measure._id)} className="delete-item">
                            <img src={trash_icon} alt="delete" />
                        </button>
                    </div>
                )) ) : (<div>אין משתמשים להצגה</div>)}
            </div>


    )
}