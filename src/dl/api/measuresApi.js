import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';
import { defineAbilitiesFor } from '../../auth/abilities';
const URL = import.meta.env.VITE_API_URL;

const getAbilityForUser = user => {
  return defineAbilitiesFor(user);
};

export const measuresApi = createApi({
  reducerPath: 'measuresApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${URL}/measures` }),
  tagTypes: ['measure'],
  endpoints: (builder) => ({
    getMeasures: builder.query({
      query: () => '/getAllMeasures',
      transformResponse: res => res.allMeasures,
      providesTags: res =>
        res ? 
        [...res.map(({ _id }) => ({ type: 'measure', _id })), { type: 'measure', _id: 'LIST' }] :
        [{ type: 'measure', _id: 'LIST' }],
    }),
    createNewMeasure: builder.mutation({
      queryFn: async ({newMeasure}, {getState}, ex, baseQuery) => {
        const state = getState();
        const ability = getAbilityForUser(state.users.user);

        if (newMeasure.measureName === '') { return {error: {message: 'חסר פרטים בטופס'}}} 
        if (!ability.can('create', 'Category')) { return {error:{ message: 'אין לך רישיון מתאים'}}};

        return await baseQuery({
          url: '/newMeasure',
          method: 'POST',
          body: newMeasure,
        })
      },
      transformResponse: res => res,
      invalidatesTags: [{ type: 'measure', _id: 'LIST' }],
    }),
    removeMeasure: builder.mutation({
      query: _id => ({
        url: `/${_id}/deleteMeasure`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'measure', _id: 'LIST' }],
    }),
  }),
});


export const { 
    useGetMeasuresQuery, 
    useCreateNewMeasureMutation,
    useRemoveMeasureMutation
  } = measuresApi;
