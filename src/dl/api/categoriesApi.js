import { mainApi } from './mainApi';
import { fieldsAreNotEmpty } from '../../hooks/fanksHook';
import { useRemoveEmptyFields } from '../../hooks/useRemoveEmptyFields';

export const categoriesApi = mainApi.injectEndpoints({
  reducerPath: 'categoriesApi',
  endpoints: builder => ({
    getCategories: builder.query({
      query: () => ({
          url:  '/categories/getAllCategories',
          headers: { 'x-action': 'read', 'x-subject': 'Category' },
      }),
      transformResponse: res => res.allcategories,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Category', _id })), { type: 'Category', _id: 'LIST' }] :
        [{ type: 'Category', _id: 'LIST' }],
    }),
    createNewCategory: builder.mutation({
      queryFn: async ({newCategory}, {}, ex, baseQuery) => {
        if (newCategory.nameCategory === '') { return {error: {message: 'חסר פרטים בטופס'}}} 
        return await baseQuery({
          url: '/categories/newCategory',
          method: 'POST',
          body: newCategory,
          headers: { 'x-action': 'create', 'x-subject': 'Category' },
        })
      },
      
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Category', _id: 'LIST' }],
    }),
    editCategory: builder.mutation({
      queryFn: async (categoryUpdated, {}, ex, baseQuery) => {        
        const dataWithOutEmptys = useRemoveEmptyFields(categoryUpdated);

        return await baseQuery({
          url: `/categories/editCategory`,
          method: 'PUT',
          body: dataWithOutEmptys,
          headers: { 'x-action': 'update', 'x-subject': 'Category' },
        })
      },
      invalidatesTags: [{ type: 'Category', _id: 'LIST' }],
    }),
    removeCategory: builder.mutation({
      query: _id => ({
        url: `/categories/${_id}/deleteCategory`,
        method: 'DELETE',
        headers: { 'x-action': 'delete', 'x-subject': 'Category' },
      }),
      invalidatesTags: [{ type: 'Category', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetCategoriesQuery, 
    useCreateNewCategoryMutation,
    useRemoveCategoryMutation,
    useEditCategoryMutation
  } = categoriesApi;
