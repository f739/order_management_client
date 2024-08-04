import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './App';
import { Home } from './pages/home';
import { Orders } from './pages/orders';
import { OldOrders } from './pages/oldOrders.jsx';
import { OrderManagement } from './pages/orderManagement.jsx';
import { Users } from './pages/subPages/Users.jsx';
import { Products } from './pages/subPages/Products.jsx';
import { Supplier } from './pages/subPages/Supplier.jsx';
import { Measure } from './pages/subPages/Measure.jsx';
import { Categories } from './pages/subPages/Categories.jsx';
import { Branches } from './pages/subPages/Branches.jsx';
import { License } from './pages/companySettings/Lisence.jsx';
import { IssuingReports } from './pages/IssuingReports.jsx';
import { Logger } from './pages/logger.jsx';
import { NoEntry } from './pages/authPages/noEntry.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { CompanyDetails } from './pages/companySettings/CompanyDetails.jsx';
import { EmailVerificationPage } from './pages/authPages/EmailVerificationPage.jsx';
import { LoginPage } from './pages/authPages/LoginPage.jsx';

export const routers = createBrowserRouter([{
    element: <Layout />,
    children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/orders",
            element: <ProtectedRoute element={Orders} action="enter" subject="Order" />
        },
        {
            path: "/orderManagement",
            element: <ProtectedRoute element={OrderManagement} action="enter" subject="PendingOrders" />
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
            path: "companySettings",
            children: [
                {path: 'companyDetails', element: <ProtectedRoute element={CompanyDetails} action="enter" subject="CompanySettings" />},
                {path: 'license', element: <ProtectedRoute element={License} action="enter" subject="License" />},

            ]
        },
        {
            path: "auth",
            children: [
                {path: 'noEntry', element: <ProtectedRoute element={NoEntry} action="enter" subject="NoEntry" />},
                {path: 'login', element: <ProtectedRoute element={LoginPage} action="enter" subject="Login" />},
                {path: 'emailVerificationPage', element: <ProtectedRoute element={EmailVerificationPage} action="enter" subject="EmailVerification" />},

            ]
        },
        {
            path: "/systemManagement",
            children: [
                { path: "Users", element: <ProtectedRoute element={Users} action="enter" subject="CreateUser" /> },
                { path: "products", element: <ProtectedRoute element={Products} action="enter" subject="Product" /> },
                { path: "supplier", element: <ProtectedRoute element={Supplier} action="enter" subject="Supplier" /> },
                { path: "measure", element: <ProtectedRoute element={Measure} action="enter" subject="Measure" /> },
                { path: "categories", element: <ProtectedRoute element={Categories} action="enter" subject="Category" /> },
                { path: "Branches", element: <ProtectedRoute element={Branches} action="enter" subject="Branches" /> },
                { path: "logger", element: <ProtectedRoute element={Logger} action="enter" subject="Log" /> },
            ]
        },

    ]
}])