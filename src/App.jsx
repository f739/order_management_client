import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import './css/main.css';

export function Layout () {
  return (
    <>
      <nav>
        <NavLink to='/'>home</NavLink> ||
        <NavLink to='/orders'>orders</NavLink> ||
        <NavLink to='/privateArea'>privateArea</NavLink>
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
