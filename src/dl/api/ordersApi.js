import { mainApi } from './mainApi';

export const ordersApi = mainApi.injectEndpoints({
  reducerPath: 'ordersApi',
  endpoints: builder => ({
    sendAnInvitation: builder.mutation({
      queryFn: async ({ user, whichBranchToSend, noteToOrder }, {getState}, ex, baseQuery ) => {
        const cart = getState().orders.cartToBookingManager;
        if (cart.length === 0){ return { error: {message: 'אין מוצרים לשליחה'}}};

        return await baseQuery({
          url: '/orders/sendAnInvitation',
          method: 'POST',
          body: { user, whichBranchToSend, note: noteToOrder, cart},
          headers: { 'x-action': 'create', 'x-subject': 'Order' },
        })
      },
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }],
    }),
    getActiveOrders: builder.query({
      query: () => ({
        url: '/orderManagement/getAllActiveOrders',
        headers: { 'x-action': 'read', 'x-subject': 'PendingOrders' },
      }),
      transformResponse: res => res.allActiveOrders,
      providesTags: result =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'ActiveOrder', id: _id })), { type: 'ActiveOrder', id: 'LIST' }] :
        [{ type: 'ActiveOrder', id: 'LIST' }],
    }),
    sendOrderFromCart: builder.mutation({
      queryFn: async ({supplier, titleMessage, messageContent, howToSend}, {getState}, ex, baseQuery) => {
        const state = getState(); 
        const cartToDeliver = state.orders.cartToDeliver;
        if (howToSend.length === 0) { return {error: {message: 'בחר שיטת שליחה'}} }
        if (cartToDeliver.length === 0){ return { error: {message: 'אין מוצרים לשליחה'}}};
        
          return await baseQuery({
            url: '/orderManagement/sendOrderToSupplier',
            method: 'POST',
            body: {cartToDeliver, supplier, titleMessage, messageContent, howToSend},
            headers: { 'x-action': 'create', 'x-subject': 'PendingOrders' },
          },{getState});
      },
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }, { type: 'OldOrder', id: 'LIST' }],
    }),
    deleteInvtation: builder.mutation({
      query: ({idInvitation}) => ({
        url: `/orderManagement/${idInvitation}/deleteInvtation`,
        method: 'PUT',
        headers: { 'x-action': 'delete', 'x-subject': 'PendingOrders' },
      }),
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }],
    }),
    removeProductInPendingOrders: builder.mutation({
      query: ({ _id, idInvitation }) => ({
        url: `/orderManagement/${_id}/${idInvitation}/removeProduct`,
        method: 'PUT',
        headers: { 'x-action': 'delete', 'x-subject': 'PendingOrders' },
      }),
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
