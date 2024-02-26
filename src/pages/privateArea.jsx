import { NavLink } from "react-router-dom";

export const PrivateArea = () => {

    return(
        <>
            <h1>PrivateArea</h1>
            <NavLink to='../orderManagement'>orderManagement</NavLink> ||
            <NavLink to='../createUsers'>createUsers</NavLink>
        </>
    )
}