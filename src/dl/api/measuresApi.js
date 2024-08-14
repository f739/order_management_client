import { mainApi } from './mainApi';
import { fieldsAreNotEmpty } from '../../hooks/fanksHook';
import { useRemoveEmptyFields } from '../../hooks/useRemoveEmptyFields';

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
    editMeasure: builder.mutation({
      queryFn: async (measureUpdated, {}, ex, baseQuery) => {
        const dataWithOutEmptys = useRemoveEmptyFields(measureUpdated);

        return await baseQuery({
          url: `/measures/editMeasure`,
          method: 'PUT',
          body: dataWithOutEmptys,
          headers: { 'x-action': 'update', 'x-subject': 'Measure' },
        })
      },
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
  }),
});


export const { 
    useGetMeasuresQuery, 
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation,
    useEditMeasureMutation
  } = measuresApi;
