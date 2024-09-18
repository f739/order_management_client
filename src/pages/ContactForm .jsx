import React, { useState } from 'react';
import { useCreateContactMutation } from '../dl/api/authApi';
import { SimpleAlert, CustomField, ButtonConfirm } from '../components/indexComponents';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel,
} from '@mui/material';
import { ThumbUpAlt, BugReport, Lightbulb } from '@mui/icons-material';
import { handleFormHook } from '../hooks/HandleFormHook';

export const ContactForm = () => {
  const [createContact, {data, isLoading, error }] = useCreateContactMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'positive',
    message: ''
  });

  const handleSubmit = async () => {
    try {
      await createContact(formData).unwrap();
    }catch (err) {}
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        צור קשר
      </Typography>
      <form >
        <CustomField
          name="name"
          value={formData.name}
          label="שם"
          onChange={e => handleFormHook(e.target, setFormData)}
          required={true}
        />
        <CustomField
          name="email"
          type="email"
          value={formData.email}
          label="אימייל"
          onChange={e => handleFormHook(e.target, setFormData)}
          required={true}
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">נושא הפנייה</FormLabel>
          <RadioGroup
            aria-label="subject"
            name="subject"
            value={formData.subject}
            onChange={e => handleFormHook(e.target, setFormData)}
            row
          >
            <FormControlLabel 
              value="positive" 
              control={<Radio />} 
              label={<Box display="flex" alignItems="center"><ThumbUpAlt color="primary" /><span>פידבק חיובי</span></Box>} 
            />
            <FormControlLabel 
              value="issue" 
              control={<Radio />} 
              label={<Box display="flex" alignItems="center"><BugReport color="error" /><span>תקלה</span></Box>} 
            />
            <FormControlLabel 
              value="suggestion" 
              control={<Radio />} 
              label={<Box display="flex" alignItems="center"><Lightbulb color="warning" /><span>הצעות לייעול</span></Box>} 
            />
          </RadioGroup>
        </FormControl>
        <CustomField
          name="message"
          value={formData.message}
          label="תוכן ההודעה"
          onChange={e => handleFormHook(e.target, setFormData)}
          type='textarea'
          rows={4}
          required={true}
        />
        <ButtonConfirm 
            confirmAction={handleSubmit}
            confirmLabel='שלח'
            isLoading={isLoading}
        />
      </form>
       {data && <SimpleAlert severity="success" message={data} />}
        {error && <SimpleAlert message={error}  /> }
    </Box>
  );
};