import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // guyActive: null,

}

export const slice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        // changeGuyActive( state, action) {
        //     state.guyActive = action.payload;  
        // }
    }
})


export const actions = slice.actions;
export default slice.reducer;