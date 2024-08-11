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
  
  const mainTabPaths = [
    '/contentManagement/products', '/contentManagement/supplier',
     '/contentManagement/categories', '/contentManagement/measure',
     '/contentManagement/Users', '/contentManagement/branches'
  ];
  const orderTabPaths = ['/orders', '/orderManagement', '/oldOrders'];
  const settingsTabPaths = ['/companySettings/companyDetails', '/companySettings/license'];
  
  const isOrderPage = orderTabPaths.some(path => location.pathname === path);
  const isSettingsPage = settingsTabPaths.some(path => location.pathname === path);
  const activePaths = isOrderPage ? orderTabPaths : isSettingsPage ? settingsTabPaths : mainTabPaths;

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
      : isSettingsPage ?
      [
        { label: "פרטי חברה", path: "/companySettings/companyDetails" },
        { label: "רישיון", path: "/companySettings/license" },
      ]
    : [
        { label: "מוצרים", path: "/contentManagement/products" },
        { label: "ספקים", path: "/contentManagement/supplier" },
        { label: "קטגוריות", path: "/contentManagement/categories" },
        { label: "יחידות מידה", path: "/contentManagement/measure" },
        { label: "משתמשים", path: "/contentManagement/Users" },
        { label: "סניפים", path: "/contentManagement/Branches" },
      ];

  const renderMainTabs = () => (
    <AppBar position="static" color="default">
      <Tabs
        value={mainTabValue}
        onChange={handleMainTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
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