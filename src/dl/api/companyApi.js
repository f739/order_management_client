import { mainApi } from './mainApi';
import { defineAbilitiesFor } from '../../auth/abilities';
import { fieldsAreNotEmpty, validEmail } from '../../hooks/fanksHook';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const compamyApi = mainApi.injectEndpoints({
  reducerPath: 'compamyApi',
  endpoints: builder => ({
    // getBranches: builder.query({
    //   query: () => '/branches/getAllBranches',
    //   transformResponse: res => res.allBranches,
    //   providesTags: res =>
    //     res ? 
    //     [...res.map(({ _id }) => ({ type: 'Branch', _id })), { type: 'Branch', _id: 'LIST' }] :
    //     [{ type: 'Branch', _id: 'LIST' }],
    // }),
    createNewCompany: builder.mutation({
      queryFn: async (newCompany, {getState}, ex, baseQuery) => {

        if (!newCompany.approvalOfRegulations) { return { error: { message: 'אשר תחילה את התקנון'}}}
        if (!fieldsAreNotEmpty(newCompany)) { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!validEmail(newCompany.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/companies/createNewCompany',
          method: 'POST',
          body: newCompany,
        })
      },
    }),
  }),
});


export const { 
    useCreateNewCompanyMutation,
  } = compamyApi;
