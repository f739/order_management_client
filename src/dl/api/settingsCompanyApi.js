import { defineAbilitiesFor } from '../../auth/abilities';
import { mainApi } from './mainApi';

export const settingsCompanyApi = mainApi.injectEndpoints({
  reducerPath: 'settingsCompanyApi',
  endpoints: (builder) => ({
    getAuthUrl: builder.query({
      query: () => '/settings/get-auth-url',
    }),
  }),
});


export const { 
    useGetAuthUrlQuery
  } = settingsCompanyApi;
