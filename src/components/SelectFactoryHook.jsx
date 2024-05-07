import { handleFormHook } from './HandleFormHook';

export const SelectFactoryHook = ({set, form, showAllFactoryLine=false, ifFunc=false, showChosseFactory=true}) => {
    return (
        <select name="factory" value={form ? form.factory : ''} onChange={e => handleFormHook(e.target, set, ifFunc)}>
            {showChosseFactory && <option value="">--בחר מפעל--</option>}
            {showAllFactoryLine &&  <option value="allFactories">כל המפעלים</option>}
            <option value="catering">קייטרינג</option>
            <option value="hazor">קייטרינג חצור</option>
            <option value="bakery">מאפיה</option>
        </select>
    )
}