import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

const URL = import.meta.env.VITE_API_URL;

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}/suppliers` }),
  tagTypes: ['supplier'],
  endpoints: builder => ({
    getSuppliers: builder.query({
      query: () => '/getAllsuppliers',
      transformResponse: res => res.allSuppliers,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'supplier', _id })), { type: 'supplier', _id: 'LIST' }] :
        [{ type: 'supplier', _id: 'LIST' }],
    }),
    createNewSupplier: builder.mutation({
      query: newSupplier => ({
        url: '/newSupplier',
        method: 'POST',
        body: newSupplier,
      }),
      transformResponse: res => res.newSupplier,
      invalidatesTags: [{ type: 'supplier', _id: 'LIST' }],
    }),
    editSupplier: builder.mutation({
      query: supplierUpdated => ({
        url: `/editSupplier`,
        method: 'PUT',
        body: supplierUpdated,
      }),
      transformErrorResponse: res => res.newSupplier,
      invalidatesTags: [{ type: 'supplier', _id: 'LIST' }],
    }),
    removeSupplier: builder.mutation({
      query: _id => ({
        url: `/${_id}/deleteSupplier`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'supplier', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetSuppliersQuery, 
    useCreateNewSupplierMutation,
    useRemoveSupplierMutation,
    useEditSupplierMutation
  } = suppliersApi;
