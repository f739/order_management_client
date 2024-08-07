import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../hooks/fanksHook';

export const suppliersApi = mainApi.injectEndpoints({
  reducerPath: 'suppliersApi',
  endpoints: builder => ({
    getSuppliers: builder.query({
      query: () => ({
        url: '/suppliers/getAllsuppliers',
        headers: { 'x-action': 'read', 'x-subject': 'Supplier' },
      }),
      transformResponse: res => res.allSuppliers,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Supplier', _id })), { type: 'Supplier', _id: 'LIST' }] :
        [{ type: 'Supplier', _id: 'LIST' }],
    }),
    createNewSupplier: builder.mutation({
      queryFn: async ({newSupplier}, {getState}, ex, baseQuery ) => {
        if (!fieldsAreNotEmpty(newSupplier)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(newSupplier.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/suppliers/newSupplier',
          method: 'POST',
          body: newSupplier,
          headers: { 'x-action': 'create', 'x-subject': 'Supplier' },
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Supplier', _id: 'LIST' }],
    }),
    editSupplier: builder.mutation({
      queryFn: async (supplierUpdated, {getState}, ex, baseQuery)  => {
        if (!fieldsAreNotEmpty(supplierUpdated)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(supplierUpdated.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: `/suppliers/editSupplier`,
          method: 'PUT',
          body: supplierUpdated,
          headers: { 'x-action': 'update', 'x-subject': 'Supplier' },
        })
      },
      invalidatesTags: [{ type: 'Supplier', _id: 'LIST' }],
    }),
    removeSupplier: builder.mutation({
      query: _id => ({
        url: `/suppliers/${_id}/deleteSupplier`,
        method: 'DELETE',
        headers: { 'x-action': 'delete', 'x-subject': 'Supplier' },
      }),
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
