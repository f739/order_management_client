import { mainApi } from './mainApi';
import { fieldsAreNotEmpty, validEmail } from '../../hooks/fanksHook';

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
  }),
});


export const { 
    useCreateNewCompanyMutation,
  } = compamyApi;
