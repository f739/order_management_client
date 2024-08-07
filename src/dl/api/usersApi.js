import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../hooks/fanksHook';

export const usersApi = mainApi.injectEndpoints({
  reducerPath: 'usersApi',
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users/getUsers',
        headers: { 'x-action': 'read', 'x-subject': 'User' },
      }),
      transformResponse: (res) => res.allUsers,
      providesTags: (result) =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'User', _id })), { type: 'User', _id: 'LIST' }] :
        [{ type: 'User', _id: 'LIST' }],
    }),
    // forward to authApi page
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
    createNewUser: builder.mutation({
      queryFn: async (formCreateUser, {getState}, ex, baseQuery)  => {
        if (!fieldsAreNotEmpty(formCreateUser)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(formCreateUser.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/users/createNewUser',
          method: 'POST',
          body: formCreateUser,
          headers: { 'x-action': 'create', 'x-subject': 'User' },
        })
      },
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
    removeUser: builder.mutation({
      query: _id => ({
        url: `/users/${_id}/deleteUser`,
        method: 'DELETE',
        headers: { 'x-action': 'delete', 'x-subject': 'User' },
      }),
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
    changeActiveUser: builder.mutation({
      query: ({active, userId}) => ({
        url: `/users/changeActiveUser`,
        method: 'PUT',
        body: {active, userId},
        headers: { 'x-action': 'update', 'x-subject': 'User' },
      }),
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetUsersQuery, 
    useTestTokenQuery, 
    useConnectUserMutation, 
    useCreateNewUserMutation, 
    useRemoveUserMutation,
    useChangeActiveUserMutation 
  } = usersApi;
