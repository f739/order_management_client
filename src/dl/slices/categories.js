import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const getCategories = createAsyncThunk('categories/getCategories', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/categories/getAllCategories`);
        return res.data.allcategories
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const createNewCategory = createAsyncThunk('categories/createNewCategory', 
  async (newCategory, {rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/categories/newCategory`, newCategory);
        return res.data.newCategory;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeCategory = createAsyncThunk('categories/removeCategory', 
  async (_id, {getState, rejectWithValue}) => {  
      try {
        const res = await $.delete(`${URL}/categories/${_id}/deleteCategory`);
        if (res) {
            const updatedCategories = getState().categories.allCategories
            .filter( el => el._id !== _id);
            return updatedCategories;
        }
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


const initialState = {
    allCategories: [],
    errorMessage: null
}

export const slice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getCategories.fulfilled, (state, action) => {
              state.allCategories = action.payload;
              state.errorMessage = '';
          })
          builder.addCase(getCategories.rejected, (state, action) => {
              state.errorMessage = action.payload;
          })
          builder.addCase(createNewCategory.fulfilled, (state, action) => {
            state.allCategories.push(action.payload);
            state.errorMessage = ''
          })
          builder.addCase(createNewCategory.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
          builder.addCase(removeCategory.fulfilled, (state, action) => {
            state.allCategories = action.payload;
            state.errorMessage = ''
          })
          builder.addCase(removeCategory.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
