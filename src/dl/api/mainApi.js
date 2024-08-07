import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const URL = import.meta.env.VITE_API_URL;

const baseQueryWithHeaders = fetchBaseQuery({
    baseUrl: URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState ,extra }) => {
        try {
            const { company, _id, email } = getState().users.user;
            
            // authorization
            if (company) {
                headers.set('x-company', company);
            }
            if (_id) {
                headers.set('x-idUser', _id);
            }
            if (email) {
                headers.set('x-email', email);
            }

        } catch (error) {
            console.error('Error preparing headers:', error);
        }
        
        return headers;
    }
})

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: baseQueryWithHeaders,
    tagTypes: ['ActiveOrder', 'OldOrder', 'Category', 'Measure', 'Product', 'Supplier', 'User', 'Branch'],
    endpoints: (builder) => ({

    }),
});