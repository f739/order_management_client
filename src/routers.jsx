import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './App';
import { Home } from './pages/home'; 
import { Orders } from './pages/orders';
import { PrivateArea } from './pages/privateArea'; 
import { OrderManagement } from './pages/orderManagement.jsx';
import { CreateUsers } from './pages/createUsers.jsx';
import { OldOrders } from './pages/oldOrders.jsx';
import { Products } from './components/Products.jsx';
import { Supplier } from './components/Supplier.jsx';
import { Measure } from './components/Measure.jsx';
import { Categories } from './components/Categories.jsx';
import { EmailSettings } from './pages/EmailSettings.jsx';
import { IssuingReports } from './pages/IssuingReports.jsx';

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
            path: "/orderManagement",
            element: <OrderManagement /> 
        },
        {
            path: "/oldOrders", 
            element: <OldOrders /> 
        },
        {
            path: "/issuingReports", 
            element: <IssuingReports /> 
        },
        {
            path: "/privateArea",
            element: <PrivateArea />,
            children: [
                {path: "createUsers", element: <CreateUsers /> },
                {path: "products", element: <Products /> },
                {path: "supplier", element: <Supplier /> },
                {path: "measure", element: <Measure /> },
                {path: "categories", element: <Categories /> },
                {path: "emailSettings", element: <EmailSettings /> },
            ]
        },
  
    ]
}])