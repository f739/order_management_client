import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

const URL = import.meta.env.VITE_API_URL;

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
      query: newMeasure => ({
        url: '/newMeasure',
        method: 'POST',
        body: newMeasure,
      }),
      transformResponse: res => res.newMeasure,
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
