import { mainApi } from './mainApi';
import { fieldsAreNotEmpty } from '../../hooks/fanksHook';

export const productsApi = mainApi.injectEndpoints({
  reducerPath: 'productsApi',
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => ({
        url: '/products/getAllProducts',
        headers: { 'x-action': 'read', 'x-subject': 'Product' },
      }),
      transformResponse: res => res.allProducts,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Product', id: _id })), { type: 'Product', id: 'LIST' }] :
        [{ type: 'Product', id: 'LIST' }],
    }),
    createNewProduct: builder.mutation({
      queryFn: async ( _, {getState, dispatch}, ex, baseQuery) => {
        const state = getState();
        const {newProduct} = state.products;

        if (!fieldsAreNotEmpty(newProduct) ||
          newProduct.price.length === 0 ||
          newProduct.branches.length === 0) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}
        };

        return await baseQuery({
          url: '/products/newProduct',
          method: 'POST',
          body: newProduct,
          headers: { 'x-action': 'create', 'x-subject': 'Product' },
        })
        // if (result.data) {
        //   dispatch( actions.cleanNewProduct());
        // }
        // return result;
      },
      transformResponse: res => res.savedProducts,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    editProduct: builder.mutation({
      queryFn: async (productUpdated, {getState}, ex, baseQuery) => {
          if (!fieldsAreNotEmpty(productUpdated)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
  
          return await baseQuery({
            url: `/products/editProduct`,
            method: 'PUT',
            body: productUpdated,
            headers: { 'x-action': 'update', 'x-subject': 'Product' },
          })
      },
      transformResponse: res => res.newProduct,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    addPrice: builder.mutation({
      queryFn: async (updatedPrices, {getState}, ex, baseQuery) => {
        if (!fieldsAreNotEmpty(updatedPrices)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}

        return await baseQuery({
          url: '/products/addPrice',
          method: 'PUT',
          body: updatedPrices,
          headers: { 'x-action': 'update', 'x-subject': 'Product' },
        })
      },
      // transformResponse: res => res.updateResults,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'ActiveOrder', id: 'LIST' }],
    }),
    deletePrice: builder.mutation({
      queryFn: async (priceId, {getState}, ex, baseQuery) => {
        if (!priceId) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}

        return await baseQuery({
          url: `/products/deletePrice/${priceId}`,
          method: 'PUT',
          headers: { 'x-action': 'update', 'x-subject': 'Product' },
        })
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'ActiveOrder', id: 'LIST' }],
    }),
    removeProduct: builder.mutation({
      query: _id => ({
        url: `/products/${_id}/deleteProduct`,
        method: 'DELETE',
        headers: { 'x-action': 'delete', 'x-subject': 'Product' },
      }),
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
