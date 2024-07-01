import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
import { fieldsAreNotEmpty } from '../../components/hooks/fanksHook';
import { defineAbilitiesFor } from '../../auth/abilities';
const URL = import.meta.env.VITE_API_URL;

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}/products` }),
  tagTypes: ['product', 'activeOrder'],
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => '/getAllProducts',
      transformResponse: res => res.allProducts,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'product', id: _id })), { type: 'product', id: 'LIST' }] :
        [{ type: 'product', id: 'LIST' }],
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
          url: '/newProduct',
          method: 'POST',
          body: newProduct,
        })
      },
      transformResponse: res => res.newProduct, // savedProducts
      invalidatesTags: [{ type: 'product', id: 'LIST' }],
    }),
    editProduct: builder.mutation({
      query: productUpdated => ({
        url: `/editProduct`,
        method: 'PUT',
        body: productUpdated,
      }),
      transformResponse: res => res.newProduct,
      invalidatesTags: [{ type: 'product', id: 'LIST' }],
    }),
    addPrice: builder.mutation({
      query: ({ price, _idSupplier, _idProduct, license}) => {
        if (license === 'purchasingManager' && price !== '' && _idSupplier !== ''  ) {
          return {
            url: `/${_idSupplier}/${price}/${_idProduct}/addPrice`,
            method: 'PUT',
          }
        }else { return {}}
      },
      transformResponse: res => res.updateProduct,
      invalidatesTags: [{ type: 'product', id: 'LIST' }, { type: 'activeOrder', id: 'LIST' }],
    }),
    removeProduct: builder.mutation({
      query: _id => ({
        url: `/${_id}/deleteProduct`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'product', id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetProductsQuery, 
    useCreateNewProductMutation,
    useRemoveProductMutation,
    useEditProductMutation,
    useAddPriceMutation,
  } = productsApi;
