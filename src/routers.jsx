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
import { Logger } from './pages/logger.jsx';
import { NoEntry } from './pages/noEntry.jsx';
import ProtectedRoute  from './ProtectedRoute.jsx';

export const routers = createBrowserRouter([{
    element: <Layout />,
    children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/noEntry",
            element: <NoEntry />
        },
        {
            path: "/orders",
            element: <ProtectedRoute element={Orders} action="enter" subject="Order" />
        },
        {
            path: "/orderManagement",
            element:  <ProtectedRoute element={OrderManagement} action="enter" subject="PendingOrders" /> 
        },
        {
            path: "/oldOrders", 
            element: <ProtectedRoute element={OldOrders} action="enter" subject="OldOrder" />
        },
        {
            path: "/issuingReports", 
            element: <ProtectedRoute element={IssuingReports} action="enter" subject="IssuingReport" />
        },
        {
            path: "/privateArea",
            element: <ProtectedRoute element={PrivateArea} action="enter" subject="NavPrivet" />,
            children: [
                {path: "createUsers", element: <ProtectedRoute element={CreateUsers} action="enter" subject="CreateUser" /> },
                {path: "products", element: <ProtectedRoute element={Products} action="enter" subject="Product" /> },
                {path: "supplier", element: <ProtectedRoute element={Supplier} action="enter" subject="Supplier" /> },
                {path: "measure", element: <ProtectedRoute element={Measure} action="enter" subject="Measure" /> },
                {path: "categories", element: <ProtectedRoute element={Categories} action="enter" subject="Category" /> },
                {path: "logger", element: <ProtectedRoute element={Logger} action="enter" subject="Log" /> },
                {path: "emailSettings", element: <ProtectedRoute element={EmailSettings} action="enter" subject="Settings" /> },
            ]
        },
  
    ]
}])