import { useEffect, useState } from "react";
import { handleFormHook } from './HandleFormHook';
import { useGetMeasuresQuery,
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation } from '../dl/api/measuresApi';
import trash_icon from '../assetes/trash_icon.svg';

export const Measure = () => {
    const [message, setMessage] = useState('')
    const [newMeasure, setNewMeasure] = useState({measureName: ''});
    const [createNewMeasure, { error, isLoading }] = useCreateNewMeasureMutation();

    useEffect(() => {
        if (error) {
            setMessage(error.data?.message || 'An error occurred');
        }
    }, [error]);

    const handleSaveNewMeasure  = async () => {
        try {
            await createNewMeasure(newMeasure).unwrap();
            setNewMeasure({measureName: ''})
        }catch (err) { return }
    }
    return (
        <div className="measure">
            <div className="new-item">
                <label>שם יחידת מידה:</label>
                    <input type="text" name="measureName" value={newMeasure.measureName} 
                    onChange={ e => handleFormHook(e.target, setNewMeasure)}/> 
                <button onClick={handleSaveNewMeasure}>שמור יחידת מידה חדשה</button>
                <span>{message}</span>
                {isLoading && <span>🌀</span>}
            </div>
            <ShowMeasures />
        </div>
        
    )
};

const ShowMeasures = () => {
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const [removeMeasure, { error: errorRemoveMeasure }] = useRemoveMeasureMutation();

    const deleteMeasure = async _id => {
        try {
            await removeMeasure(_id).unwrap();
        }catch (err) {
            console.log(err);
            console.log(errorRemoveMeasure);
        }
    }
    if (errorGetMeasures) return <h3>ERROR: {errorGetMeasures.error}</h3>
    if (isLoadingGetMeasures) return <h1>🌀 Loading...</h1>;
    return (
        <div className="show-items measure-items">
                <h1 className="title">יחידות מידה קיימות:</h1>
                {allMeasures && allMeasures.length > 0 ? (
                 allMeasures.map( measure => (
                    <div key={measure._id} className="show-item">
                        <span>{measure.measureName}</span>
                        <button onClick={() => deleteMeasure(measure._id)} className="delete-item">
                            <img src={trash_icon} alt="delete" className="icon"/>
                        </button>
                    </div>
                )) ) : (<div>אין משתמשים להצגה</div>)}
            </div>


    )
}