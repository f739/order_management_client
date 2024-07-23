import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
import { mainApi } from './mainApi';
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const ordersApi = mainApi.injectEndpoints({
  reducerPath: 'ordersApi',
  endpoints: builder => ({
    getActiveOrders: builder.query({
      query: () => '/orderManagement/getAllActiveOrders',
      transformResponse: res => res.allActiveOrders,
      providesTags: result =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'ActiveOrder', id: _id })), { type: 'ActiveOrder', id: 'LIST' }] :
        [{ type: 'ActiveOrder', id: 'LIST' }],
    }),
    sendAnInvitation: builder.mutation({
      queryFn: async ({ user, whichBranchToSend, noteToOrder }, {getState}, ex, baseQuery ) => {
        const state = getState();
        const cart = state.orders.cartToBookingManager;
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('create', 'Order')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (cart.length === 0){ return { error: {message: 'אין מוצרים לשליחה'}}};
        return await baseQuery({
          url: '/orders/sendAnInvitation',
          method: 'POST',
          body: { user, whichBranchToSend, note: noteToOrder, cart},
        })
      },
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }, { type: 'OldOrder', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }],
    }),
    removeProductInPendingOrders: builder.mutation({
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
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }],
    }),
  }),
});

export default ordersApi;
export const { 
  useGetActiveOrdersQuery,
  useSendAnInvitationMutation,
  useSendOrderFromCartMutation,
  useRemoveProductInPendingOrdersMutation,
  useDeleteInvtationMutation,
 } = ordersApi;
