import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../hooks/fanksHook';
import { arePasswordsEqual } from '../../hooks/validatePasswords';

export const authApi = mainApi.injectEndpoints({
  reducerPath: 'authApi',
  endpoints: (builder) => ({
    connectUser: builder.mutation({
      queryFn: async (form, {}, ex, baseQuery) => {
        if (!fieldsAreNotEmpty(form)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(form.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: `/auth/login`,
          method: 'PUT',
          body: form,
          headers: { 'x-action': 'auth', 'x-subject': 'User' },
        })
      },
    }),
    verifyEmailAndUpdatePass: builder.mutation({
      queryFn: async ({tempPassword ,newPassword, confirmPassword, email}, {getState}, ex, baseQuery) => {
        if (!arePasswordsEqual(newPassword, confirmPassword)) {return { error: { message: 'הסיסמאות אינן שוות'}}};
          return await baseQuery({
            url: `/auth/verifyEmailAndUpdatePass`,
            method: 'PUT',
            body: {tempPassword, newPassword, email},
            headers: { 'x-action': 'auth', 'x-subject': 'Company' },
         });
      },
    }),
    resetPassword: builder.mutation({
      queryFn: async ({email}, {getState}, ex, baseQuery) => {
        if (!email) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        
          return await baseQuery({
            url: `/auth/resetPassword`,
            method: 'PUT',
            body: {email},
            headers: { 'x-action': 'auth', 'x-subject': 'User' },
         });
      },
    }),
    verificationEmailAuto: builder.query({
      query: ({email, isUser}) => ({
        url: `/auth/verifyEmailDetails/${email}/${isUser}`,
        headers: { 'x-action': 'auth', 'x-subject': 'User' },
      })
    }),
    createContact: builder.mutation({
      queryFn: async (form, {getState}, ex, baseQuery) => {
        if (!fieldsAreNotEmpty(form)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(form.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

          return await baseQuery({
            url: `/auth/createContact`,
            method: 'POST',
            body: form,
            headers: { 'x-action': 'create', 'x-subject': 'ContactForm' },
         });
      },
    }),
  }),
});


export const { 
  useVerifyEmailAndUpdatePassMutation,
  useConnectUserMutation, 
  useResetPasswordMutation,
  useVerificationEmailAutoQuery,
  useCreateContactMutation
  } = authApi;
