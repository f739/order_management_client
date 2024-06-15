import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
const URL = import.meta.env.VITE_API_URL;
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}` }),
  tagTypes: ['activeOrder', 'oldOrder'],
  endpoints: builder => ({
    getActiveOrders: builder.query({
      query: () => '/orderManagement/getAllActiveOrders',
      transformResponse: res => res.allActiveOrders,
      providesTags: result =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'activeOrder', id: _id })), { type: 'activeOrder', id: 'LIST' }] :
        [{ type: 'activeOrder', id: 'LIST' }],
    }),
    sendAnInvitation: builder.mutation({
      query: ({ user, whichFactoryToSend, note }) => ({
        url: '/orders/sendAnInvitation',
        method: 'POST',
        body: { user, whichFactoryToSend, note },
      }),
      invalidatesTags: [{ type: 'activeOrder', id: 'LIST' }],
    }),
    sendOrderFromCart: builder.mutation({
      queryFn: async ({supplier, titleMessage, messageContent, howToSend}, {getState}, ex, baseQuery) => {
        const state = getState(); 
        const ability = getAbilityForUser(state.users.user);
        const cartToDeliver = state.orders.cartToDeliver;

        if (!ability.can('create', 'PendingOrders')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (cartToDeliver.length === 0){ return { error: {message: 'אין מוצרים לשליחה'}}};
          return await baseQuery({
            url: '/orderManagement/sendOrderToSupplier',
            method: 'POST',
            body: {cartToDeliver, supplier, titleMessage, messageContent, howToSend},
          },{getState});
      },
      invalidatesTags: [{ type: 'activeOrder', id: 'LIST' }, { type: 'oldOrder', id: 'LIST' }],
    }),
    deleteInvtation: builder.mutation({
      queryFn: async  ({idInvitation}, {getState}, ex, baseQuery) => {
        const user = getState().users.user;
        const ability = getAbilityForUser(user);
        if (!ability.can('delete', 'PendingOrders')) { return {error:{ message: 'אין לך רישיון מתאים'}}}
        return await baseQuery({
          url: `/orderManagement/${idInvitation}/deleteInvtation`,
          method: 'PUT',
        },{getState});
      },
      invalidatesTags: [{ type: 'activeOrder', id: 'LIST' }],
    }),
    removeProduct: builder.mutation({
      queryFn: async ({ _id, idInvitation }, {getState}, ex, baseQuery) => {
        const user = getState().users.user;
        const ability = getAbilityForUser(user);
        if (!ability.can('delete', 'PendingOrders')) { return {error:{ message: 'אין לך רישיון מתאים'}}}
        return await baseQuery({
          url: `/orderManagement/${_id}/${idInvitation}/removeProduct`,
          method: 'PUT',
        },{getState});
      },
      transformResponse: res => res.doc,
      invalidatesTags: [{ type: 'activeOrder', id: 'LIST' }],
    }),
  }),
});

export default ordersApi;
export const { 
  useGetActiveOrdersQuery,
  useSendAnInvitationMutation,
  useSendOrderFromCartMutation,
  useRemoveProductMutation,
  useDeleteInvtationMutation,
 } = ordersApi;
