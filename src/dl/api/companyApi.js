import { mainApi } from './mainApi';
import { fieldsAreNotEmpty, validEmail, } from '../../hooks/fanksHook';
import { useRemoveEmptyFields } from '../../hooks/useRemoveEmptyFields';

export const compamyApi = mainApi.injectEndpoints({
  reducerPath: 'compamyApi',
  endpoints: builder => ({
    getCompany: builder.query({
      query: () => ({
          url:  '/companies/getCompany',
          headers: { 'x-action': 'read', 'x-subject': 'Company' },
      }),
      transformResponse: res => res.company,
      providesTags: res => {
        if (!res) { return [{ type: 'User', _id: 'LIST' }] }
        const tags = Object.keys(res).map(key => ({ type: 'Company', _id: res[key]._id }));
        tags.push({ type: 'Company', _id: 'LIST' });
        return tags;
      }
    }),
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
    editCompanyDetails: builder.mutation({
      queryFn: async (companyUpdated, {}, ex, baseQuery) => {        
        const dataWithOutEmptys = useRemoveEmptyFields(companyUpdated);
        
        if (!validEmail(dataWithOutEmptys.email)) { return { error: {message: 'האימייל אינו תקני'}}} 

        return await baseQuery({
          url: `/companies/editCompanyDetails`,
          method: 'PUT',
          body: dataWithOutEmptys,
          headers: { 'x-action': 'update', 'x-subject': 'Company' },
        })
      },
      invalidatesTags: [{ type: 'Company', _id: 'LIST' }],
    }),
    editingCompanyEmailDetails: builder.mutation({
      queryFn: async (emailUpdated, {}, ex, baseQuery) => {        
        if (!fieldsAreNotEmpty(emailUpdated)) { return {error: {message: 'חסר פרטים בטופס'}}};
        if (!validEmail(emailUpdated.email)) { return { error: {message: 'האימייל אינו תקני'}}} 
        if (emailUpdated.password?.length !== 16){ return { error: {message: 'הסיסמה אינה תקינה'}}}
        return await baseQuery({
          url: `/companies/editingCompanyEmailDetails`,
          method: 'PUT',
          body: emailUpdated,
          headers: { 'x-action': 'update', 'x-subject': 'Company' },
        })
      },
      invalidatesTags: [{ type: 'Company', _id: 'LIST' }],
    }),
    editingCompanyWhatsappDetails: builder.mutation({
      queryFn: async (whatsappUpdated, {}, ex, baseQuery) => {        
        const dataWithOutEmptys = useRemoveEmptyFields(whatsappUpdated);

        return await baseQuery({
          url: `/companies/editingCompanyWhatsappDetails`,
          method: 'PUT',
          body: dataWithOutEmptys,
          headers: { 'x-action': 'update', 'x-subject': 'Company' },
        })
      },
      invalidatesTags: [{ type: 'Company', _id: 'LIST' }],
    }),
    buyLicense: builder.mutation({
      queryFn: async (timeUnit, {getState}, ex, baseQuery) => {    
        const { company, email } = getState().users.user;

        return await baseQuery({
          url:  '/companies/buyLicense',
          method: 'PUT',
          body: { email, companyId: company, timeUnit },
          headers: { 'x-action': 'updateLicense', 'x-subject': 'Company' },
        })
      },
      invalidatesTags: [{ type: 'Company', _id: 'LIST' }],
    }),
    // removeCompany: builder.mutation({
    //   query: _id => ({
    //     url: `/companies/${_id}/deleteCompany`,
    //     method: 'DELETE',
    //     headers: { 'x-action': 'delete', 'x-subject': 'Company' },
    //   }),
    //   invalidatesTags: [{ type: 'Company', _id: 'LIST' }],
    // }),
  }),
});


export const { 
    useGetCompanyQuery,
    useCreateNewCompanyMutation,
    useEditCompanyDetailsMutation,
    useEditingCompanyEmailDetailsMutation,
    useEditingCompanyWhatsappDetailsMutation,
    useBuyLicenseMutation,
  } = compamyApi;
