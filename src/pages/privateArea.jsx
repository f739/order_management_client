import { NavLink, Outlet } from "react-router-dom";

export const PrivateArea = () => {

    return(
        <>
        <nav>
            <NavLink to='./orderManagement'>הזמנות חדשות</NavLink> ||
            <NavLink to='./oldOrders'>הזמנות בתהליך</NavLink> ||
            <NavLink to='./createUsers'>משתמשים</NavLink> ||
            <NavLink to='./products'>מוצרים</NavLink> ||
            <NavLink to='./categories'>קטגוריות</NavLink> ||
            <NavLink to='./supplier'>ספקים</NavLink> ||
            <NavLink to='./measure'>יחידות מידה</NavLink> ||
            <NavLink to='./emailSettings'>הגדרות אימייל</NavLink> ||

        </nav>
            <Outlet />
        </>
    )
}