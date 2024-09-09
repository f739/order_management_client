import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const URL = import.meta.env.VITE_API_URL;

const baseQueryWithHeaders = fetchBaseQuery({
    baseUrl: URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState ,extra }) => {
        try {
            const { email } = getState().users.user;
            
            // authorization
            const companyToken = localStorage.getItem('tokenCompany');
            const userToken = localStorage.getItem('userToken');
            
            if (companyToken) {
                headers.set('x-token-company', companyToken)
            }
            if (userToken) {
                headers.set('x-token-user', userToken)
            }
            if (email) {
                headers.set('x-email', email);
            }
            // headers.set('Cache-Control', 'no-cache');
            
        } catch (error) {
            console.error('Error preparing headers:', error);
        }
        
        return headers;
    }
})

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: baseQueryWithHeaders,
    tagTypes: ['ActiveOrder', 'OldOrder', 'Category', 'Measure', 'Product', 'Supplier', 'User', 'Branch','Users'],
    endpoints: (builder) => ({

    }),
});