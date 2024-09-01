import { mainApi } from './mainApi';
import { validEmail, fieldsAreNotEmpty } from '../../hooks/fanksHook';
import { useRemoveEmptyFields } from '../../hooks/useRemoveEmptyFields';

export const userSettingsApi = mainApi.injectEndpoints({
  reducerPath: 'userSettingsApi',
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
          url:  '/userSettings/getUser',
          headers: { 'x-action': 'read', 'x-subject': 'User' },
      }),
      transformResponse: res => res.user,
      providesTags: res => {
        if (!res) { return [{ type: 'User', _id: 'LIST' }] }
        const tags = Object.keys(res).map(key => ({ type: 'User', _id: res[key]._id }));
        tags.push({ type: 'User', _id: 'LIST' });
        return tags;
      }
    }),
    editUserDetails: builder.mutation({
      queryFn: async (userUpdated, {}, ex, baseQuery) => {        
        const dataWithOutEmptys = useRemoveEmptyFields(userUpdated);
        if (dataWithOutEmptys.email && !validEmail(dataWithOutEmptys.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: `/userSettings/editUserDetails`,
          method: 'PUT',
          body: dataWithOutEmptys,
          headers: { 'x-action': 'update', 'x-subject': 'User' },
        })
      },
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
    editingUserEmailDetails: builder.mutation({
      queryFn: async (emailUpdated, {}, ex, baseQuery) => {    

        if (!fieldsAreNotEmpty(emailUpdated)) { return {error: {message: 'חסר פרטים בטופס'}}};
        if (!validEmail(emailUpdated.email)) { return { error: {message: 'האימייל אינו תקני'}}} 
        if (emailUpdated.password?.length !== 16){ return { error: {message: 'הסיסמה אינה תקינה'}}}

        return await baseQuery({
          url: `/userSettings/editingUserEmailDetails`,
          method: 'PUT',
          body: emailUpdated,
          headers: { 'x-action': 'update', 'x-subject': 'User' },
        })
      },
      invalidatesTags: [{ type: 'User', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetUserQuery, 
    useEditUserDetailsMutation,
    useEditingUserEmailDetailsMutation,
  } = userSettingsApi;
