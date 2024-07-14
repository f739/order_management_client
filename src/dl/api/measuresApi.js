import { defineAbilitiesFor } from '../../auth/abilities';
import { mainApi } from './mainApi';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const measuresApi = mainApi.injectEndpoints({
  reducerPath: 'measuresApi',
  endpoints: (builder) => ({
    getMeasures: builder.query({
      query: () => '/measures/getAllMeasures',
      transformResponse: res => res.allMeasures,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Measure', _id })), { type: 'Measure', _id: 'LIST' }] :
        [{ type: 'Measure', _id: 'LIST' }],
    }),
    createNewMeasure: builder.mutation({
      queryFn: async ({newMeasure}, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (newMeasure.measureName === '') { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!ability.can('create', 'Category')) { return {error:{ message: 'אין לך רישיון מתאים'}}};

        return await baseQuery({
          url: '/measures/newMeasure',
          method: 'POST',
          body: newMeasure,
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Measure', _id: 'LIST' }],
    }),
    removeMeasure: builder.mutation({
      query: _id => ({
        url: `/measures/${_id}/deleteMeasure`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Measure', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetMeasuresQuery, 
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation
  } = measuresApi;
