import { AppBarSystemManagement } from "../../components/AppBarSystemManagement";
import { useState } from "react";

export const CompanyDetails = (props) => {
  const [secondaryTabValue, setSecondaryTabValue] = useState(1);
  const secondaryTabs = [];

  const changeTab = (e, newValue) => {
    setSecondaryTabValue(newValue)
  }
  return (
    <>
      <AppBarSystemManagement 
        secondaryTabs={secondaryTabs}
        secondaryTabValue={secondaryTabValue}
        onSecondaryTabChange={changeTab} 
      />
    </>
  );
};