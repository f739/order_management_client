import { Outlet, RouterProvider, NavLink } from "react-router-dom";
import { routers } from "./routers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/main.css';

export function Layout () {
  return (
    <>
      <nav>
        <NavLink to='/orders'>הזמנות חדשות</NavLink> ||
        <NavLink to='/privateArea'>אזור אישי</NavLink>
      </nav>
      <ToastContainer />
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
