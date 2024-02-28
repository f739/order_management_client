import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import './css/main.css';

export function Layout () {
  return (
    <>
      <nav>
        <NavLink to='/orders'>הזמנות חדשות</NavLink> ||
        <NavLink to='/privateArea'>אזור אישי</NavLink>
      </nav>
      <Outlet />
    </>
  )
}

function App() {

  return (
      <div>
        <RouterProvider router={routers} />
      </div>
  );
}

export default App
