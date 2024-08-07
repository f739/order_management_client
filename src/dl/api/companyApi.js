import { mainApi } from './mainApi';
import { fieldsAreNotEmpty, validEmail } from '../../hooks/fanksHook';
import { arePasswordsEqual } from '../../hooks/validatePasswords';

export const compamyApi = mainApi.injectEndpoints({
  reducerPath: 'compamyApi',
  endpoints: builder => ({
    createNewCompany: builder.mutation({
      queryFn: async (newCompany, {getState}, ex, baseQuery) => {

        if (!newCompany.approvalOfRegulations) { return { error: { message: 'אשר תחילה את התקנון'}}}
        if (!fieldsAreNotEmpty(newCompany)) { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!validEmail(newCompany.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/companies/createNewCompany',
          method: 'POST',
          body: newCompany,
          headers: { 'x-action': 'create', 'x-subject': 'Company' },
        })
      },
    }),
    // forward to authaApi
    verifyEmailAndUpdatePass: builder.mutation({
      queryFn: async ({tempPassword ,newPassword, confirmPassword}, {getState}, ex, baseQuery) => {
        if (!arePasswordsEqual(newPassword, confirmPassword)) {return { error: { message: 'הסיסמאות אינן שוות'}}};
          return await baseQuery({
            url: `/users/verifyEmailAndUpdatePass`,
            method: 'PUT',
            body: {tempPassword, newPassword},
            headers: { 'x-action': 'login', 'x-subject': 'Company' },
         });
      },
    }),
  }),
});


export const { 
    useCreateNewCompanyMutation,
    useVerifyEmailAndUpdatePassMutation
  } = compamyApi;
