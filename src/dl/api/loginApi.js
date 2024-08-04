import { defineAbilitiesFor } from '../../auth/abilities';
import { mainApi } from './mainApi';

export const login = mainApi.injectEndpoints({
  reducerPath: 'login',
  endpoints: (builder) => ({
    
  }),
});


export const { 
    
  } = login;
