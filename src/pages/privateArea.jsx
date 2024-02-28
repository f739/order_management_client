import { NavLink, Outlet } from "react-router-dom";

export const PrivateArea = () => {

    return(
        <>
        <nav>
            <NavLink to='./orderManagement'>הזמנות חדשות</NavLink> ||
            <NavLink to='./oldOrders'>הזמנות בתהליך</NavLink> ||
            <NavLink to='./createUsers'>משתמשים</NavLink>
        </nav>
            <Outlet />
        </>
    )
}