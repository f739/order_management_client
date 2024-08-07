import { mainApi } from './mainApi';
import { fieldsAreNotEmpty } from '../../hooks/fanksHook';

export const branchesApi = mainApi.injectEndpoints({
  reducerPath: 'branchesApi',
  endpoints: builder => ({
    getBranches: builder.query({
      query: () => ({
        url: '/branches/getAllBranches',
        headers: { 'x-action': 'read', 'x-subject': 'Branch' },
      }),
      transformResponse: res => res.allBranches,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Branch', _id })), { type: 'Branch', _id: 'LIST' }] :
        [{ type: 'Branch', _id: 'LIST' }],
    }),
    createNewBranch: builder.mutation({
      queryFn: async ({newBranch}, {getState}, ex, baseQuery) => {
    
        if (!fieldsAreNotEmpty(newBranch)) { return {error: {message: 'חסר פרטים בטופס'}}} 
        return await baseQuery({
          url: '/branches/newBranch',
          method: 'POST',
          body: newBranch,
          headers: { 'x-action': 'create', 'x-subject': 'Branch' },
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Branch', _id: 'LIST' }],
    }),
    removeBranch: builder.mutation({
      query: _id => ({
        url: `/branches/${_id}/deleteBranch`,
        method: 'DELETE',
        headers: { 'x-action': 'delete', 'x-subject': 'Branch' },
      }),
      invalidatesTags: [{ type: 'Branch', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetBranchesQuery, 
    useCreateNewBranchMutation,
    useRemoveBranchMutation
  } = branchesApi;
