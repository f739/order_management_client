import { useEffect, useState } from "react";
import { Box, AppBar, Tabs, Tab } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';

const a11yProps = index => {
    return {
      id: `action-tab-${index}`,
      'aria-controls': `action-tabpanel-${index}`,
    };
}

export const AppBarSystemManagement = ({tabs, valueTab, changeTab}) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const tabPaths = ['../products', '../supplier', '../categories', '../measure', '../users'];
  
    const getCurrentTab = pathname => {
        const index = tabPaths.findIndex(path => pathname.includes(path.replace('..', '')));
        return index === -1 ? 0 : index;
    };

    const [value, setValue] = useState(getCurrentTab(location.pathname));
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
      console.log(getCurrentTab(location.pathname));
      navigate(tabPaths[newValue]);
    };
  
    useEffect(() => {
      setValue(getCurrentTab(location.pathname));
    }, [location.pathname]);

    return (
        <>
        
        <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="action tabs example"
                >
                    <Tab label="מוצרים" {...a11yProps(0)} />
                    <Tab label="ספקים" {...a11yProps(1)} />
                    <Tab label="קטגוריות" {...a11yProps(2)} />
                    <Tab label="יחידות מידה" {...a11yProps(3)} />
                    <Tab label="משתמשים" {...a11yProps(4)} />
                </Tabs>
            </AppBar> 
            <AppBar position="static" color="default">
                <Tabs
                    value={valueTab}
                    onChange={changeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="action tabs example"
                >
                    {tabs && tabs.map( (nameEl, i) => (
                        <Tab key={i} label={nameEl} {...a11yProps(i)} />
                    ))}
                </Tabs>
            </AppBar>
        </>
    )
}