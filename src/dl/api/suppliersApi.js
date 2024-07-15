import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../components/hooks/fanksHook';
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const suppliersApi = mainApi.injectEndpoints({
  reducerPath: 'suppliersApi',
  endpoints: builder => ({
    getSuppliers: builder.query({
      query: () => '/suppliers/getAllsuppliers',
      transformResponse: res => res.allSuppliers,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Supplier', _id })), { type: 'Supplier', _id: 'LIST' }] :
        [{ type: 'Supplier', _id: 'LIST' }],
    }),
    createNewSupplier: builder.mutation({
      queryFn: async ({newSupplier}, {getState}, ex, baseQuery ) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);
        
        if (!ability.can('create', 'Supplier')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!fieldsAreNotEmpty(newSupplier)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(newSupplier.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/suppliers/newSupplier',
          method: 'POST',
          body: newSupplier,
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Supplier', _id: 'LIST' }],
    }),
    editSupplier: builder.mutation({
      queryFn: async (supplierUpdated, {getState}, ex, baseQuery)  => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('update', 'Supplier')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!fieldsAreNotEmpty(supplierUpdated)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(supplierUpdated.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: `/suppliers/editSupplier`,
          method: 'PUT',
          body: supplierUpdated,
        })
      },
      invalidatesTags: [{ type: 'Supplier', _id: 'LIST' }],
    }),
    removeSupplier: builder.mutation({
      queryFn: async (_id, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('delete', 'Supplier')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        return await baseQuery({
          url: `/suppliers/${_id}/deleteSupplier`,
          method: 'DELETE',
        })
      },
      invalidatesTags: [{ type: 'Supplier', _id: 'LIST' }, { type: 'Product', _id: 'LIST'}],
    }),
  }),
});


export const { 
    useGetSuppliersQuery, 
    useCreateNewSupplierMutation,
    useRemoveSupplierMutation,
    useEditSupplierMutation
  } = suppliersApi;
