import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { defineAbilitiesFor } from './auth/abilities';
import { useJwtParser } from './hooks/useJwtParser';
import { LoudingPage } from './components/LoudingPage';
import { ErrorPage } from './components/ErrorPage';

const ProtectedRoute = ({ element: Component, action, subject }) => {
  const location = useLocation();
  const { user } = useSelector(state => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const ability = defineAbilitiesFor(user || { role: 'guest' });

  useJwtParser(user.email);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);
  const error = {status: 403, data: { message: 'אינך מורשה להיכנס לעמוד זה'}}
  if (isLoading) {
    return <LoudingPage />;
  }else if (ability.can(action, subject)) {
    return <Component />;
  }else {
    return <ErrorPage error={error} />
  }
};

export default ProtectedRoute;