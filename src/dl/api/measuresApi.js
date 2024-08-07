import { defineAbilitiesFor } from '../../auth/abilities';
import { mainApi } from './mainApi';

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const measuresApi = mainApi.injectEndpoints({
  reducerPath: 'measuresApi',
  endpoints: (builder) => ({
    getMeasures: builder.query({
      query: () => ({
        url: '/measures/getAllMeasures',
        headers: { 'x-action': 'read', 'x-subject': 'Measure' },
      }),
      transformResponse: res => res.allMeasures,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'Measure', _id })), { type: 'Measure', _id: 'LIST' }] :
        [{ type: 'Measure', _id: 'LIST' }],
    }),
    createNewMeasure: builder.mutation({
      queryFn: async ({newMeasure}, {getState}, ex, baseQuery) => {
        
        if (newMeasure.measureName === '') { return {error: {message: 'חסר פרטים בטופס'}}} 
        return await baseQuery({
          url: '/measures/newMeasure',
          method: 'POST',
          body: newMeasure,
          headers: { 'x-action': 'create', 'x-subject': 'Measure' },
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'Measure', _id: 'LIST' }],
    }),
    removeMeasure: builder.mutation({
      query: _id => ({
        url: `/measures/${_id}/deleteMeasure`,
        method: 'DELETE',
        headers: { 'x-action': 'delete', 'x-subject': 'Measure' },
      }),
      invalidatesTags: [{ type: 'Measure', _id: 'LIST' }],
    }),
    changeActiveMeasure: builder.mutation({
      query: ({active, measureId}) => ({
        url: `/measures/changeActiveMeasure`,
        method: 'PUT',
        body: {active, measureId},
        headers: { 'x-action': 'update', 'x-subject': 'Measure' },
      }),
      invalidatesTags: [{ type: 'Measure', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetMeasuresQuery, 
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation,
    useChangeActiveMeasureMutation
  } = measuresApi;
