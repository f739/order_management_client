import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './App';
import { Home } from './pages/home';
import { Orders } from './pages/orders';
import { OldOrders } from './pages/oldOrders.jsx';
import { OrderManagement } from './pages/orderManagement.jsx';
import { Users } from './pages/contentManagement/Users.jsx';
import { Products } from './pages/contentManagement/Products.jsx';
import { Supplier } from './pages/contentManagement/Supplier.jsx';
import { Measure } from './pages/contentManagement/Measure.jsx';
import { Categories } from './pages/contentManagement/Categories.jsx';
import { Branches } from './pages/contentManagement/Branches.jsx';
import { UserDetails } from './pages/settings/userSettings/UserDetails.jsx';
import { IssuingReports } from './pages/IssuingReports.jsx';
import { Logger } from './pages/logger.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { CompanyDetails } from './pages/settings/companySettings/CompanyDetails.jsx';
import { EmailVerificationPage } from './pages/authPages/EmailVerificationPage.jsx';
import { LoginPage } from './pages/authPages/LoginPage.jsx';
import { ResetPassword } from './pages/authPages/ResetPassword.jsx';
import { Verification } from './pages/authPages/Verification.jsx';
import { ContactForm } from './pages/ContactForm .jsx';

export const routers = createBrowserRouter([{
    element: <Layout />,
    children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/issuingReports",
            element: <ProtectedRoute element={IssuingReports} action="enter" subject="IssuingReport" />
        },
        {
            path: "/contactForm",
            element: <ProtectedRoute element={ContactForm} action="enter" subject="ContactForm" />
        },
        {
            path: "auth",
            children: [
                { path: 'login/:email?', element: <ProtectedRoute element={LoginPage} action="enter" subject="auth" /> },
                { path: 'emailVerificationPage/:email?', element: <ProtectedRoute element={EmailVerificationPage} action="enter" subject="auth" /> },
                { path: 'resetPassword', element: <ProtectedRoute element={ResetPassword} action="enter" subject="auth" /> },
                { path: 'verification/:email/:isUser', element: <ProtectedRoute element={Verification} action="enter" subject="auth" /> },
            ]
        },
        {
            path: "orders",
            children: [
                { path: '', element: <ProtectedRoute element={Orders} action="enter" subject="Order" /> },
                { path: 'orderManagement', element: <ProtectedRoute element={OrderManagement} action="enter" subject="PendingOrders" /> },
                { path: 'oldOrders', element: <ProtectedRoute element={OldOrders} action="enter" subject="OldOrder" /> },
            ]
        },
        {
            path: "contentManagement",
            children: [
                { path: "users", element: <ProtectedRoute element={Users} action="enter" subject="contentManagement" /> },
                { path: "products", element: <ProtectedRoute element={Products} action="enter" subject="contentManagement" /> },
                { path: "supplier", element: <ProtectedRoute element={Supplier} action="enter" subject="contentManagement" /> },
                { path: "measure", element: <ProtectedRoute element={Measure} action="enter" subject="contentManagement" /> },
                { path: "categories", element: <ProtectedRoute element={Categories} action="enter" subject="contentManagement" /> },
                { path: "Branches", element: <ProtectedRoute element={Branches} action="enter" subject="contentManagement" /> },
                { path: "logger", element: <ProtectedRoute element={Logger} action="enter" subject="Log" /> },
            ]
        },
        {
            path: "companySettings",
            children: [
                { path: 'companyDetails', element: <ProtectedRoute element={CompanyDetails} action="enter" subject="CompanySettings" /> },
                { path: 'userDetails', element: <ProtectedRoute element={UserDetails} action="enter" subject="UserDetails" /> },

            ]
        },

    ]
}])