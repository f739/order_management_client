import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { actions } from '../dl/slices/auth';
import { useNavigate } from 'react-router-dom';

export const useJwtParser = (emailUser) => {
  const dispatch = useDispatch();
  const naigate = useNavigate();

  useEffect(() => {
    const parseAndValidateToken = () => {
      const userToken = localStorage.getItem('userToken');
      const tokenCompany = localStorage.getItem('tokenCompany');
      const ifVerifiedEmail = localStorage.getItem('ifVerifiedEmail');
      if (userToken && tokenCompany) {
        try {
          const decoded = jwtDecode(userToken);
          const decodedCompany = jwtDecode(tokenCompany);
          console.log(decodedCompany.exp);
          
          // const currentTime = Date.now() / 1000;
          // if (decodedCompany?.exp > currentTime) {
          //   // handleLogout();
          //   naigate('/companySettings/companyDetails', {message: 'הרישיון של החברה נגמר לא ניתן לבצע פעולות באתר'});
          // } 
          dispatch(actions.updateUserInfo({
            _id: decoded._id,
            email: decoded.email,
            userName: decoded.userName,
            role: decoded.role,
            branch: decoded.branch,
            company: decodedCompany.companyId,
            ifVerifiedEmail: ifVerifiedEmail ?? false,
          }));
          
        } catch (error) {
          console.error('שגיאה בפענוח הטוקן:', error);
          // handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    !emailUser && parseAndValidateToken();
  }, [dispatch, emailUser]);

  const handleLogout = () => {
    dispatch(actions.logOut());
  };

  return null; 
};