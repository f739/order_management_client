import { mainApi } from './mainApi';
import { defineAbilitiesFor } from '../../auth/abilities';
import { fieldsAreNotEmpty } from '../../hooks/fanksHook';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const branchesApi = mainApi.injectEndpoints({
  reducerPath: 'branchesApi',
  endpoints: builder => ({
    getBranches: builder.query({
      query: () => '/branches/getAllBranches',
      transformResponse: res => res.allBranches,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Branch', _id })), { type: 'Branch', _id: 'LIST' }] :
        [{ type: 'Branch', _id: 'LIST' }],
    }),
    createNewBranch: builder.mutation({
      queryFn: async ({newBranch}, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);
        
        if (!fieldsAreNotEmpty(newBranch)) { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!ability.can('create', 'Branch')) { return {error:{ message: 'אין לך רישיון מתאים'}}};

        return await baseQuery({
          url: '/branches/newBranch',
          method: 'POST',
          body: newBranch,
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Branch', _id: 'LIST' }],
    }),
    removeBranch: builder.mutation({
      query: _id => ({
        url: `/branches/${_id}/deleteBranch`,
        method: 'DELETE',
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
