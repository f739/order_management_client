
import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

const URL = import.meta.env.VITE_API_URL;

const tokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}` }),
  tagTypes: ['User'],
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
      query: formCreateUser => ({
        url: '/users/createNewUser',
        method: 'POST',
        body: formCreateUser,
      }),
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
    removeUser: builder.mutation({
      query: _id => ({
        url: `/users/${_id}/deleteUser`,
        method: 'DELETE',
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
    useRemoveUserMutation 
  } = usersApi;
