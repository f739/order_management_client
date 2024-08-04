import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { defineAbilitiesFor } from './auth/abilities';
import { useJwtParser } from './hooks/useJwtParser';
import { LoudingPage } from './components/LoudingPage';
import { EmailVerificationPage } from './pages/authPages/EmailVerificationPage';
import { LoginPage } from './pages/authPages/LoginPage';

const ProtectedRoute = ({ element: Component, action, subject }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocation, setIsLocation] = useState(location);
  const ability = defineAbilitiesFor(user || { license: 'guest' });

  useJwtParser(user.email);

  useEffect(() => {
    if (!isLoading) {
      if (!user.email) {
        navigate('/auth/login', { state: { from: location } });
      } else if (!user.ifVerifiedEmail) {
        navigate('/auth/emailVerificationPage', { state: { from: location } });
      } else if (!ability.can(action, subject)) {
        navigate('/auth/noEntry', { state: { from: location } });
      }
    }

    return (
      setIsLocation(false)
    )
  }, [user.email, isLoading, isLocation ]);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <LoudingPage />;
  }
  if (location.pathname === '/auth/login') {
    return <Component />
  }else if (!user.ifVerifiedEmail) {
    return <EmailVerificationPage />;
  }else if (ability.can(action, subject)) {
    return <Component />;
  }

  return null;
};

export default ProtectedRoute;
