import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
const URL = import.meta.env.VITE_API_URL;
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const oldOrdersApi = createApi({
  reducerPath: 'oldOrdersApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}` }),
  tagTypes: ['oldOrder', 'activeOrder'],
  endpoints: builder => ({
    getOldOrders: builder.query({
      query: () => '/oldOrders/getOldOrders',
      transformResponse: res => res.oldOrders,
      providesTags: result =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'oldOrder', _id })), { type: 'oldOrder', _id: 'LIST' }] :
        [{ type: 'oldOrder', _id: 'LIST' }],
    }),
    returnProduct: builder.mutation({
      queryFn: async ( data, {getState}, ex, baseQuery) => {
        console.log(data);
        const { user } = getState().users;
        const ability = getAbilityForUser(user);
        if (!ability.can('delete', 'OldOrder')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
          
        return await baseQuery( {
            url: '/oldOrders/returnProduct',
            method: 'POST',
            body: data,
          })
      },
      invalidatesTags: [{ type: 'activeOrder', _id: 'LIST' }, { type: 'oldOrder', _id: 'LIST' }],
    }),
    removeProductInOldOrder: builder.mutation({
      queryFn: async ({ _id, idOrderList }, {getState}, ex, baseQuery) => {
        const { user } = getState().users;
        const ability = getAbilityForUser(user);
        if (!ability.can('delete', 'OldOrder')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        
        return await baseQuery({
          url: `${URL}/oldOrders/${_id}/${idOrderList}/removeProductInOldOrder`,
          method: 'PUT',
        })
      },
      transformResponse: res => res.doc,
      invalidatesTags: [{ type: 'oldOrder', _id: 'LIST' }],
    }),
    productReceived: builder.mutation({
      query: productData => ({
        url: `${URL}/oldOrders/productReceived`,
        method: 'PUT',
        body: productData
      }),
      transformResponse: res => res.orderUpdated,
      invalidatesTags: [{ type: 'oldOrder', _id: 'LIST' }],
    }),
  }),
});

export default oldOrdersApi;
export const { 
  useGetOldOrdersQuery,
  useReturnProductMutation,
  useRemoveProductInOldOrderMutation,
  useProductReceivedMutation
 } = oldOrdersApi;
