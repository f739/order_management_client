import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
import { defineAbilitiesFor } from '../../auth/abilities';
const URL = import.meta.env.VITE_API_URL;

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

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
      queryFn: async ({newCategory}, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);
        
        if (newCategory.nameCategory === '') { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!ability.can('create', 'Category')) { return {error:{ message: 'אין לך רישיון מתאים'}}};

        return await baseQuery({
          url: '/newCategory',
          method: 'POST',
          body: newCategory,
        })
      },
      transformResponse: res => res,
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
