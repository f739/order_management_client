import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../hooks/fanksHook';
import { arePasswordsEqual } from '../../hooks/validatePasswords';

export const authApi = mainApi.injectEndpoints({
  reducerPath: 'authApi',
  endpoints: (builder) => ({
    connectUser: builder.mutation({
      query: (form) => {
        if (!fieldsAreNotEmpty(form)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(form.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return {
          url: `/auth/login`,
          method: 'PUT',
          body: form,
          headers: { 'x-action': 'login', 'x-subject': 'User' },
        }
      },
    }),
    verifyEmailAndUpdatePass: builder.mutation({
      queryFn: async ({tempPassword ,newPassword, confirmPassword}, {getState}, ex, baseQuery) => {
        if (!arePasswordsEqual(newPassword, confirmPassword)) {return { error: { message: 'הסיסמאות אינן שוות'}}};
          return await baseQuery({
            url: `/auth/verifyEmailAndUpdatePass`,
            method: 'PUT',
            body: {tempPassword, newPassword},
            headers: { 'x-action': 'login', 'x-subject': 'Company' },
         });
      },
    }),
    resetPassword: builder.mutation({
      queryFn: async ({email}, {getState}, ex, baseQuery) => {
        console.log('email', email);
        if (!email) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        
          return await baseQuery({
            url: `/auth/resetPassword`,
            method: 'PUT',
            body: {email},
            headers: { 'x-action': 'login', 'x-subject': 'User' },
         });
      },
    })
  }),
});


export const { 
  useVerifyEmailAndUpdatePassMutation,
  useConnectUserMutation, 
  useResetPasswordMutation,
  } = authApi;
