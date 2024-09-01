import React from "react";
import { Box, Typography } from '@mui/material';

export const LicenseInfo = () => {
  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5">רישיון חברה</Typography>
      <Typography variant="h6">תחילת שימוש: 16.03.2023</Typography>
      <Typography variant="h6">תאריך תפוגה: 28.03.2023</Typography>
    </Box>
  );
};