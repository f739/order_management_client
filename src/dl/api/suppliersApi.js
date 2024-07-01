import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
import { validEmail, fieldsAreNotEmpty } from '../../components/hooks/fanksHook';
import { defineAbilitiesFor } from '../../auth/abilities';
const URL = import.meta.env.VITE_API_URL;

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

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
      queryFn: async ({newSupplier}, {getState}, ex, baseQuery ) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);
        
        if (!ability.can('create', 'Supplier')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!fieldsAreNotEmpty(newSupplier)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(newSupplier.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/newSupplier',
          method: 'POST',
          body: newSupplier,
        })
      },
      transformResponse: res => res,
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
