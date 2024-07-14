import { mainApi } from './mainApi';
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const categoriesApi = mainApi.injectEndpoints({
  reducerPath: 'categoriesApi',
  endpoints: builder => ({
    getCategories: builder.query({
      query: () => '/categories/getAllCategories',
      transformResponse: res => res.allcategories,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Category', _id })), { type: 'Category', _id: 'LIST' }] :
        [{ type: 'Category', _id: 'LIST' }],
    }),
    createNewCategory: builder.mutation({
      queryFn: async ({newCategory}, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);
        
        if (newCategory.nameCategory === '') { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!ability.can('create', 'Category')) { return {error:{ message: 'אין לך רישיון מתאים'}}};

        return await baseQuery({
          url: '/categories/newCategory',
          method: 'POST',
          body: newCategory,
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Category', _id: 'LIST' }],
    }),
    removeCategory: builder.mutation({
      query: _id => ({
        url: `/categories/${_id}/deleteCategory`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetCategoriesQuery, 
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation
  } = categoriesApi;
