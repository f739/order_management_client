import { mainApi } from './mainApi';
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const oldOrdersApi = mainApi.injectEndpoints({
  reducerPath: 'oldOrdersApi',
  endpoints: builder => ({
    getOldOrders: builder.query({
      query: () => '/oldOrders/getOldOrders',
      transformResponse: res => res.oldOrders,
      providesTags: result =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'OldOrder', _id })), { type: 'OldOrder', _id: 'LIST' }] :
        [{ type: 'OldOrder', _id: 'LIST' }],
    }),
    returnProduct: builder.mutation({
      queryFn: async ( data, {getState}, ex, baseQuery) => {
        const { user } = getState().users;
        const ability = getAbilityForUser(user);
        if (!ability.can('delete', 'OldOrder')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
          
        return await baseQuery( {
            url: '/oldOrders/returnProduct',
            method: 'POST',
            body: data,
          })
      },
      invalidatesTags: [{ type: 'ActiveOrder', _id: 'LIST' }, { type: 'OldOrder', _id: 'LIST' }],
    }),
    removeProductInOldOrder: builder.mutation({
      queryFn: async ({ _id, idOrderList }, {getState}, ex, baseQuery) => {
        const { user } = getState().users;
        const ability = getAbilityForUser(user);
        if (!ability.can('delete', 'OldOrder')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        
        return await baseQuery({
          url: `/oldOrders/${_id}/${idOrderList}/removeProductInOldOrder`,
          method: 'PUT',
        })
      },
      transformResponse: res => res.doc,
      invalidatesTags: [{ type: 'OldOrder', _id: 'LIST' }],
    }),
    productReceived: builder.mutation({
      query: productData => ({
        url: `/oldOrders/productReceived`,
        method: 'PUT',
        body: productData
      }),
      transformResponse: res => res.orderUpdated,
      invalidatesTags: [{ type: 'OldOrder', _id: 'LIST' }],
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
