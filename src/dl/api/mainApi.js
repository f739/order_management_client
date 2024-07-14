import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const URL = import.meta.env.VITE_API_URL;

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({ baseUrl: URL }),
    tagTypes: ['ActiveOrder', 'OldOrder','Category', 'Measure', 'Product', 'Supplier', 'User'],
    endpoints: (builder) => ({
    
    }),
});

