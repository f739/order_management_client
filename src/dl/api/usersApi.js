import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../components/hooks/fanksHook';
import { defineAbilitiesFor } from '../../auth/abilities';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

const tokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

export const usersApi = mainApi.injectEndpoints({
  reducerPath: 'usersApi',
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users/getUsers',
      transformResponse: (res) => res.allUsers,
      providesTags: (result) =>
        result ? 
        [...result.map(({ _id }) => ({ type: 'User', _id })), { type: 'User', _id: 'LIST' }] :
        [{ type: 'User', _id: 'LIST' }],
    }),
    connectUser: builder.mutation({
      query: ({email, password}) => `/login/${password}/${email}/connectUser`,
      transformResponse: res => res?.user,
    }),
    testToken: builder.query({
      query: () => {
        const localToken = tokenFromLocalStorage();
        if (!localToken) {
          return { url: '/', method: 'GET' };
        }  
        return {
          url: `/login/${localToken}/testToken`,
          method: 'GET',
        }
      },  
      transformResponse: res => res?.user ?? null,
    }),
    createNewUser: builder.mutation({
      queryFn: async (formCreateUser, {getState}, ex, baseQuery)  => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (!ability.can('create', 'User')) { return {error:{ message: 'אין לך רישיון מתאים'}}};
        if (!fieldsAreNotEmpty(formCreateUser)) { return  {error:{ message: 'חסר פרטים הכרחיים בטופס'}}}
        if (!validEmail(formCreateUser.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: '/users/createNewUser',
          method: 'POST',
          body: formCreateUser,
        })
      },
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
    removeUser: builder.mutation({
      query: _id => ({
        url: `/users/${_id}/deleteUser`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
    changeActiveUser: builder.mutation({
      queryFn: async ({active, userId}, {getState}, ex, baseQuery) => {

        return await baseQuery({
          url: `/users/changeActiveUser`,
          method: 'PUT',
          body: {active, userId}
        })
      },
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
