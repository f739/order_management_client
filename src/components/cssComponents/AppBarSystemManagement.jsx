import { useEffect, useState } from "react";
import { Box, AppBar, Tabs, Tab } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';

const getTabProps = (index) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

export const AppBarSystemManagement = ({ secondaryTabs = [], secondaryTabValue, onSecondaryTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const mainTabPaths = ['/systemManagement/products', '/systemManagement/supplier', '/systemManagement/categories', '/systemManagement/measure', '/systemManagement/Users'];
  const orderTabPaths = ['/orders', '/orderManagement', '/oldOrders'];
  
  const isOrderPage = orderTabPaths.some(path => location.pathname === path);
  const activePaths = isOrderPage ? orderTabPaths : mainTabPaths;

  const getCurrentTab = (pathname) => {
    const index = activePaths.findIndex(path => pathname === path);
    return index === -1 ? 0 : index;
  };

  const [mainTabValue, setMainTabValue] = useState(getCurrentTab(location.pathname));
  
  const handleMainTabChange = (event, newValue) => {
    setMainTabValue(newValue);
    navigate(activePaths[newValue]);
  };
  
  useEffect(() => {
    setMainTabValue(getCurrentTab(location.pathname));
  }, [location.pathname]);

  const mainTabs = isOrderPage
    ? [
        { label: "הזמנות", path: "/orders" },
        { label: "הזמנות בתהליך", path: "/orderManagement" },
        { label: "קבלת הזמנות", path: "/oldOrders" },
      ]
    : [
        { label: "מוצרים", path: "/systemManagement/products" },
        { label: "ספקים", path: "/systemManagement/supplier" },
        { label: "קטגוריות", path: "/systemManagement/categories" },
        { label: "יחידות מידה", path: "/systemManagement/measure" },
        { label: "משתמשים", path: "/systemManagement/Users" },
      ];

  const renderMainTabs = () => (
    <AppBar position="static" color="default">
      <Tabs
        value={mainTabValue}
        onChange={handleMainTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="main navigation tabs"
      >
        {mainTabs.map((tab, index) => (
          <Tab key={tab.path} label={tab.label} {...getTabProps(index)} />
        ))}
      </Tabs>
    </AppBar>
  );

  const renderSecondaryTabs = () => (
    !isOrderPage && secondaryTabs.length > 0 && (
      <AppBar position="static" color="default">
        <Tabs
          value={secondaryTabValue}
          onChange={onSecondaryTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="secondary navigation tabs"
        >
          {secondaryTabs.map((tabName, index) => (
            <Tab key={index} label={tabName} {...getTabProps(index)} />
          ))}
        </Tabs>
      </AppBar>
    )
  );

  return (
    <>
      {renderMainTabs()}
      {renderSecondaryTabs()}
    </>
  );
};