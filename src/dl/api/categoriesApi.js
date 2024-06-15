import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

const URL = import.meta.env.VITE_API_URL;

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}/categories` }),
  tagTypes: ['category'],
  endpoints: builder => ({
    getCategories: builder.query({
      query: () => '/getAllCategories',
      transformResponse: res => res.allcategories,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'category', _id })), { type: 'category', _id: 'LIST' }] :
        [{ type: 'category', _id: 'LIST' }],
    }),
    createNewCategory: builder.mutation({
      query: newCategory => ({
        url: '/newCategory',
        method: 'POST',
        body: newCategory,
      }),
      transformResponse: res => res.newCategory,
      invalidatesTags: [{ type: 'category', _id: 'LIST' }],
    }),
    removeCategory: builder.mutation({
      query: _id => ({
        url: `/${_id}/deleteCategory`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'category', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetCategoriesQuery, 
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation
  } = categoriesApi;
