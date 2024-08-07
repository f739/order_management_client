import { mainApi } from './mainApi';

export const oldOrdersApi = mainApi.injectEndpoints({
  reducerPath: 'oldOrdersApi',
  endpoints: builder => ({
    getOldOrders: builder.query({
      query: () => ({
        url: '/oldOrders/getOldOrders',
        headers: { 'x-action': 'read', 'x-subject': 'OldOrder' },
      }),
      transformResponse: res => res.oldOrders,
      providesTags: result =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'OldOrder', _id })), { type: 'OldOrder', _id: 'LIST' }] :
        [{ type: 'OldOrder', _id: 'LIST' }],
    }),
    returnProduct: builder.mutation({
      query: data => ({
        url: '/oldOrders/returnProduct',
        method: 'POST',
        body: data,
        headers: { 'x-action': 'delete', 'x-subject': 'OldOrder' },
      }),
      invalidatesTags: [{ type: 'ActiveOrder', _id: 'LIST' }, { type: 'OldOrder', _id: 'LIST' }],
    }),
    removeProductInOldOrder: builder.mutation({
      query: ({ _id, idOrderList }) => ({
        url: `/oldOrders/${_id}/${idOrderList}/removeProductInOldOrder`,
        method: 'PUT',
        headers: { 'x-action': 'delete', 'x-subject': 'OldOrder' },
      }),
      transformResponse: res => res.doc,
      invalidatesTags: [{ type: 'OldOrder', _id: 'LIST' }],
    }),
    productReceived: builder.mutation({
      query: productData => ({
        url: `/oldOrders/productReceived`,
        method: 'PUT',
        body: productData,
        headers: { 'x-action': 'update', 'x-subject': 'OldOrder' },
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
