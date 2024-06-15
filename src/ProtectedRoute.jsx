import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { defineAbilitiesFor } from './auth/abilities';

const ProtectedRoute = ({ element: Component, action, subject }) => {
  const { user } = useSelector( state => state.users);
  
  const ability = defineAbilitiesFor(user || { license: 'guest' });
  const location = useLocation();

  if (ability.can(action, subject)) {
    return <Component />;
  } else {
    return <Navigate to="/noEntry" state={{ from: location }} />;
  }
};

export default ProtectedRoute;
