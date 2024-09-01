import {  AppBar, Tabs, Tab } from '@mui/material'

const getTabProps = (index) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

export const AppBarSystemManagement = ({ secondaryTabs = [], secondaryTabValue, onSecondaryTabChange }) => {
  const renderSecondaryTabs = () => (
     secondaryTabs.length > 0 && (
      <AppBar position="static" color="default">
        <Tabs
          value={secondaryTabValue}
          onChange={onSecondaryTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
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
      {renderSecondaryTabs()}
    </>
  );
};