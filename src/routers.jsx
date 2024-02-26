import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './App';
import { Home } from './pages/home'; 
import { Orders } from './pages/orders';
import { PrivateArea } from './pages/privateArea'; 
import { OrderManagement } from './pages/orderManagement.jsx';
import { CreateUsers } from './pages/createUsers.jsx';

export const routers = createBrowserRouter([{
    element: <Layout />,
    children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/orders",
            element: <Orders />
        },
        {
            path: "/privateArea",
            element: <PrivateArea />,
        },
        {path: "/orderManagement", element: <OrderManagement /> },
        {path: "/createUsers", element: <CreateUsers /> },
  
    ]
}])