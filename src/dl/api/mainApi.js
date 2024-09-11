import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const URL = import.meta.env.VITE_API_URL;

const baseQueryWithHeaders = fetchBaseQuery({
    baseUrl: URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState ,extra }) => {
        try {            
            const companyToken = localStorage.getItem('tokenCompany');
            const userToken = localStorage.getItem('userToken');
            
            if (companyToken) {
                headers.set('x-token-company', companyToken)
            }
            if (userToken) {
                headers.set('x-token-user', userToken)
            }
            // headers.set('Cache-Control', 'no-cache');
            
        } catch (error) {
            console.error('Error preparing headers:', error);
        }
        
        return headers;
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQueryWithHeaders(args, api, extraOptions);
    
    if (result.meta?.response?.headers) {
        const userToken = result.meta.response.headers.get('X-New-Token-User');
        const companyToken = result.meta.response.headers.get('X-New-Token-Company');
        
        if (companyToken) {
            localStorage.setItem('tokenCompany', companyToken);
        }
        if (userToken) {   
            console.log('userToken: ' ,userToken);
                     
            localStorage.setItem('userToken', userToken);
        }
    }
    // if (result.error && result.error.status === 401) { }

    return result;
}

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ActiveOrder', 'OldOrder', 'Category', 'Measure', 'Product', 'Supplier', 'User', 'Branch','Users'],
    endpoints: (builder) => ({

    }),
});