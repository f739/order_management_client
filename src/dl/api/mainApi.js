import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const URL = import.meta.env.VITE_API_URL;

const baseQueryWithHeaders = fetchBaseQuery({
    baseUrl: URL,
    prepareHeaders: (headers, { getState }) => {
        try {
            const { company, _id, email } = getState().users.user;

            if (company) {
                headers.set('companyId', company);
            }
            if (_id) {
                headers.set('idUser', _id);
            }
            if (email) {
                headers.set('emailUser', email);
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