import { useEffect, useState } from "react";
import { URL } from "../services/service";
import $ from 'axios';
import '../css/measure.css';

export const Measure = () => {
    const [newMeasure, setNewMeasure] = useState({measureName: ''});
    const [allMeasures, setAllMeasures] = useState([]);

    useEffect( () => {
        const getMeasures = async () => {
            try {
                const res = await $.get(`${URL}/measure/getAllMeasures`);
                console.log(res);
                setAllMeasures(res.data.allMeasures)
            }catch (err) {
                console.log(err);
            }
        }; getMeasures();
    },[]);

    const handleFormNewMeasure = ({target}) => {
        const { value, name } = target;
        setNewMeasure( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    const handleSaveNewMeasure  = async () => {
        try {
            const res = await $.post(`${URL}/measure/newMeasure`, newMeasure);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="measure">
            <div className="new-measure">
                <label>
                    שם יחידת מידה:
                    <input type="text" name="measureName" onChange={handleFormNewMeasure}/> 
                </label>
                <button onClick={handleSaveNewMeasure}>שמור יחידת מידה חדשה</button>
            </div>
            <div className="show-measure">
                <h1 className="title">יחידות מידה קיימות:</h1>
                {allMeasures && allMeasures.map( measure => (
                    <ShowMeasures key={measure._id}
                    measureName={measure.measureName}  
                    id={measure._id} />
                ))}
            </div>
        </div>
        
    )
};

const ShowMeasures = props => {
    const { measureName, id } = props;
    const deleteMeasure = async () => {
        try {
            const res = await $.delete(`${URL}/measure/${id}/deletemeasure`);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="show-measure">
            <span>{measureName}</span>
            <button onClick={deleteMeasure}>מחק יחידת מידה</button>
        </div>
    )
}