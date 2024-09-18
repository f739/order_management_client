import React from "react";
import { Box, Typography, Alert } from '@mui/material';
import { useGetCompanyQuery, useEditingCompanyEmailDetailsMutation } from "../../../dl/api/companyApi";
import { ErrorPage, LoudingPage } from '../../../components/indexComponents';
import { GeneralCompanyInfo } from "./GeneralCompanyInfo";
import { EmailDetails } from "../EmailDetails";
import { WhatsAppDetails } from "./WhatsAppDetails";
import { LicenseInfo } from "./LicenseInfo";

export const CompanyDetails = () => {
  const { data: company, error: errorGetCompany, isLoading: isLoadingCompany } = useGetCompanyQuery();
  const [updateEmailDetails,
    { 
      isLoading: isLoadingUpdateEmail,
      error: errorUpdateEmail,
      isSuccess
    }
  ] = useEditingCompanyEmailDetailsMutation();

  if (isLoadingCompany) return <LoudingPage />;
  if (errorGetCompany) return <ErrorPage error={errorGetCompany} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '40px' }}>
        הגדרות חברה
      </Typography>

      <GeneralCompanyInfo company={company} />
      <Typography variant="h4" sx={{ marginBottom: '40px' }}>
        הגדרות שליחת הודעות
      </Typography>
      <EmailDetails 
        isUser={false}
        emailDetails={company.sendingMessages.email} 
        onUpdateEmail={updateEmailDetails} 
        isLoadingUpdateEmail={isLoadingUpdateEmail}
        isSuccess={isSuccess}
        errorUpdateEmail={errorUpdateEmail}
      />
      {/* <WhatsAppDetails 
        whatsAppDetails={company.sendingMessages.watsapp} 
      /> */}
      <LicenseInfo company={company} />
    </Box>
  );
};




















// import React, { useState } from "react";
// import { Divider, Typography, Box, Alert } from '@mui/material';
// import { CustomField } from "../../../components/CustomField";
// import { handleFormHook } from "../../../hooks/HandleFormHook";
// import { ButtonConfirm } from "../../../components/icons/ButtonConfirm";
// import { useGetCompanyQuery, useEditCompanyDetailsMutation,
//    useEditingCompanyEmailDetailsMutation,
//     useEditingCompanyWhatsappDetailsMutation } from "../../../dl/api/companyApi";

// export const CompanyDetails = () => {
//   const { data: company, error: errorGetCompany, isLoading: isLoadingCompany } = useGetCompanyQuery(); 
//   const [updateCompanyDetails, {isLouding: isLoudingEdit}] = useEditCompanyDetailsMutation();
//   const [updateEmailDetails, {isLouding: isLoudingVerifyEmail}] = useEditingCompanyEmailDetailsMutation();
//   const [updateWhatsappDetails, {isLouding: isLoudingVerifyPhone}] = useEditingCompanyWhatsappDetailsMutation();
  
//   const [editCompanyDetails, setEditCompanyDetails] = useState({
//     nameCompany: '', companyRegistration: '', address: '', logo: ''
//   });
//   const [emailDetails, setEmailDetails] = useState({
//     email: '', password: '', ifVerified: false
//   });
//   const [phoneDetails, setPhoneDetails] = useState({
//     phone: '', password: '', ifVerified: false
//   });




//   const fields = [
//     {
//       key: 'companyDetails',
//       title: 'פרטי חברה',
//       data: editCompanyDetails,
//       setData: setEditCompanyDetails,
//       fields: [
//         {name: 'nameCompany', label: "שם החברה", type: 'input'},
//         {name: 'companyRegistration', label: "ח.פ.", type: 'input', typeInput: 'number'},
//         {name: 'address', label: "כתובת", type: 'input'},
//         {name: 'logo', label: "לוגו חברה", type: 'input', typeInput: 'file'},
//         {name: 'confirm', label: "שמור שינויים", type: 'button'}
//       ]
//     },
//     {
//       key: 'emailDetails',
//       title: 'שליחת הודעות',
//       data: emailDetails,
//       setData: setEmailDetails,
//       fields: [
//         {name: 'email', label: "דואר אלקטרוני", type: 'input', typeInput: 'email'},
//         {name: 'password', label: "סיסמה בת 16 ספרות לגימייל", type: 'input'},
//         {name: 'ifVerified', label: 'אימות אמייל', type: 'button'}
//       ]
//     },
//     {
//       key: 'phoneDetails',
//       title: '',
//       data: phoneDetails,
//       setData: setPhoneDetails,
//       fields: [
//         {name: 'phone', label: "פלאפון", type: 'input', typeInput: 'tel'},
//         {name: 'password', label: "סיסמה לווצאפ", type: 'input'},
//         {name: 'ifVerified', label: 'אימות פלאפון', type: 'button'}
//       ]
//     }
//   ];

//   return (
//     <Box sx={{ p: 5 }}>
//       <Alert variant="standard" severity="warning">לא ניתן לשלוח אימיילים כל עוד שלא אומתו</Alert>
//       <Typography variant="h4" sx={{ marginBottom: '40px' }}>
//         הגדרות חברה
//       </Typography>

//       {fields.map(section => (
//         <Box sx={{ p: 5 }} key={section.key}>
//           <Typography variant="h5">
//             {section.title}
//           </Typography>
//           {section.fields.map(field => (
//             <React.Fragment key={field.name}>
//               {field.type === 'input' ? (
//                 <CustomField 
//                   name={field.name}
//                   type={field.typeInput ?? null}
//                   value={section.data[field.name]}
//                   label={field.label}
//                   variant="outlined"
//                   margin='dense'
//                   onChange={e => handleFormHook(e.target, section.setData)}
//                 />
//               ) : (
//                 <ButtonConfirm 
//                     confirmLabel={field.label}
//                     // confirmAction={}
//                     // isLouding={ }
//                 />
//               )}
//             </React.Fragment>
//           ))}
//           {section.key === 'emailDetails' && <Divider />}
//         </Box>
//       ))}

//       <Divider />
//       <Typography variant="h5">
//         רישיון חברה
//       </Typography>
//         logout{/* <LogOut /> */}
//       <Typography variant="h6">
//         תחילת שימוש: 16.03.2023
//       </Typography>
//       <Typography variant="h6">
//         תאריך תפוגה: 28.03.2023
//       </Typography>
//       {/* <LicenseOptions /> */}
//     </Box>
//   );
// };
