// import { useState } from 'react';
// import { handleFormHook } from '../hooks/HandleFormHook';
// import { toast } from "react-toastify";
// import '../css/settings.css';
// const URL = import.meta.env.VITE_API_URL
// import $ from 'axios';

// export const EmailSettings = () => {
//     const [editDetalseEmail, setEditDetalseEmail] = useState({ email: '', code: '' });
//     // const [getAuthUrl, ] = useGetAuthUrlQuery;
//     const sendForm = async () => {
//         if (editDetalseEmail.code && editDetalseEmail.email) {
//             try {
//                 const res = await $.put(`${URL}/settings/email`, editDetalseEmail);
//                 toast.success(res.data.message);
//             } catch (err) {
//                 toast.error(err.response.data.message);
//             }
//         } else {
//             toast.error('חסר פרטים הכרחיים בטופס');
//         }
//     }
//     const deleteDbOrdersReceived = async () => {
//         try {
//             const res = await $.put(`${URL}/settings/deleteDbOrdersReceived`);
//             toast.success(res.data.message);
//         } catch (err) {
//             toast.error(err.response.data.message);
//         }
//     }

//     const getAuthUrl = async () => {
//         try {
//             const res = await $.get(`${URL}/settings/get-auth-url`);
//             console.log(res);
//             const { url } = res.data
//             window.open(url, '_blank');
//         } catch (err) {
//             console.log(err);
//         }

//     }
//     return (
//         <>
//             <div className='form-edit-detales-email form'>
//                 <div> <strong>שנה הגדרות אימייל לשליחה:</strong></div>
//                 <label>אימייל:</label>
//                 <input type="email" name="email"
//                     onChange={e => handleFormHook(e.target, setEditDetalseEmail)} />
//                 <label>קוד בן 16 ספרות:</label>
//                 <input type="text" name="code"
//                     onChange={e => handleFormHook(e.target, setEditDetalseEmail)} />
//                 <button onClick={sendForm}>שנה פרטים</button>
//             </div>
//             <div className='form-edit-detales-email form'>
//                 <div style={{ color: 'red' }}>זהירות...</div>
//                 <button onClick={deleteDbOrdersReceived} className='delete-db'>מחק נתונים! מהזמנות שהתקבלו כבר</button>
//             </div>
//             <div className='form-edit-detales-email form'>
//                 <button onClick={getAuthUrl}>קבל טוקן מגגוגל</button>

//             </div>

//         </>
//     )
// }