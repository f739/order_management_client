import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { NoEntry } from "./noEntry";

export const PrivateArea = () => {
    const license = useSelector( state => state.users.user.license);
    
    return(
        <>
            {license === 'purchasingManager' ?
            <> 
                <nav>
                    <NavLink to='./createUsers'>משתמשים</NavLink>
                    <NavLink to='./products'>מוצרים</NavLink>
                    <NavLink to='./categories'>קטגוריות</NavLink>
                    <NavLink to='./supplier'>ספקים</NavLink>
                    <NavLink to='./measure'>יחידות מידה</NavLink>
                    <NavLink to='./logger'>לוגר</NavLink>
                    <NavLink to='./emailSettings'>הגדרות</NavLink>
                </nav>
                <Outlet />
            </>
             : <NoEntry />} 
        </>
    )
}