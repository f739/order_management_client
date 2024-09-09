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
        [...result.map(({ _id }) => ({ type: 'OldOrder', id: _id })), { type: 'OldOrder', id: 'LIST' }] :
        [{ type: 'OldOrder', id: 'LIST' }],
    }),
    returnProduct: builder.mutation({
      query: data => ({
        url: '/oldOrders/returnProduct',
        method: 'POST',
        body: data,
        headers: { 'x-action': 'delete', 'x-subject': 'OldOrder' },
      }),
      invalidatesTags: [{ type: 'ActiveOrder', id: 'LIST' }, { type: 'OldOrder', id: 'LIST' }],
    }),
    removeProductInOldOrder: builder.mutation({
      query: ({ _id, idOrderList }) => ({
        url: `/oldOrders/${_id}/${idOrderList}/removeProductInOldOrder`,
        method: 'PUT',
        headers: { 'x-action': 'delete', 'x-subject': 'OldOrder' },
      }),
      transformResponse: res => res.doc,
      invalidatesTags: [{ type: 'OldOrder', id: 'LIST' }],
    }),
    productReceived: builder.mutation({
      query: productData => ({
        url: `/oldOrders/productReceived`,
        method: 'PUT',
        body: productData,
        headers: { 'x-action': 'update', 'x-subject': 'OldOrder' },
      }),
      transformResponse: res => res.orderUpdated,
      invalidatesTags: [{ type: 'OldOrder', id: 'LIST' }],
    }),
    sendingPhoto: builder.mutation({
      query: ({image, numberOrder}) => ({
        url: `/oldOrders/sendingPhotoOfADeliveryCertificate`,
        method: 'POST',
        body: {image, numberOrder},
        headers: { 'x-action': 'update', 'x-subject': 'OldOrder' },
      }),
      invalidatesTags: [{ type: 'OldOrder', id: 'LIST' }],
    }),
  }),
});

export default oldOrdersApi;
export const { 
  useGetOldOrdersQuery,
  useReturnProductMutation,
  useRemoveProductInOldOrderMutation,
  useProductReceivedMutation,
  useSendingPhotoMutation
 } = oldOrdersApi;
