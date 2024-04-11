import { handleFormHook } from './HandleFormHook';

export const SelectFactoryHook = ({set, form, showAllFactoryLine=false, ifFunc=false}) => {
    return (
        <select name="factory" value={form ? form.factory : ''} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            <option value="">--בחר מפעל--</option>
            {showAllFactoryLine &&  <option value="allFactories">כל המפעלים</option>}
            <option value="catering">קייטרינג</option>
            <option value="restaurant">מסעדה</option>
            <option value="bakery">מאפיה</option>
        </select>
    )
}