import { mainApi } from './mainApi';
import { fieldsAreNotEmpty } from '../../components/hooks/fanksHook';
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const productsApi = mainApi.injectEndpoints({
  reducerPath: 'productsApi',
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => '/products/getAllProducts',
      transformResponse: res => res.allProducts,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Product', id: _id })), { type: 'Product', id: 'LIST' }] :
        [{ type: 'Product', id: 'LIST' }],
    }),
    createNewProduct: builder.mutation({
      queryFn: async ( newProduct, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);
        console.log(newProduct);
        if (!ability.can('create', 'Product')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!fieldsAreNotEmpty(newProduct) ||
          newProduct.price.length === 0 ||
          newProduct.factories.length === 0) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}
        };

        return await baseQuery({
          url: '/products/newProduct',
          method: 'POST',
          body: newProduct,
        })
      },
      transformResponse: res => res.newProduct, // savedProducts
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    editProduct: builder.mutation({
      queryFn: async (productUpdated, {getState}, ex, baseQuery) => {
          const state = getState();
          const ability = getAbilityForUser(state.users.user);
  
          if (!ability.can('update', 'Product')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
          if (!fieldsAreNotEmpty(productUpdated)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
  
          return await baseQuery({
            url: `/products/editProduct`,
            method: 'PUT',
            body: productUpdated,
          })
      },
      transformResponse: res => res.newProduct,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    addPrice: builder.mutation({
      queryFn: async (updatedPrices, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('update', 'Product')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!fieldsAreNotEmpty(updatedPrices)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}

        return await baseQuery({
          url: '/products/addPrice',
          method: 'PUT',
          body: updatedPrices
        })
      },
      transformResponse: res => res.updateProduct,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'ActiveOrder', id: 'LIST' }],
    }),
    deletePrice: builder.mutation({
      queryFn: async (priceId, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('update', 'Product')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!priceId) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}

        return await baseQuery({
          url: `/products/deletePrice/${priceId}`,
          method: 'PUT'
        })
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'ActiveOrder', id: 'LIST' }],
    }),
    removeProduct: builder.mutation({
      queryFn: async (_id, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('delete', 'Product')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        return await baseQuery({
          url: `/products/${_id}/deleteProduct`,
          method: 'DELETE',
        })
      },
      // transformErrorResponse: err => err.data.message,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetProductsQuery, 
    useCreateNewProductMutation,
    useRemoveProductMutation,
    useEditProductMutation,
    useAddPriceMutation,
    useDeletePriceMutation,
  } = productsApi;
