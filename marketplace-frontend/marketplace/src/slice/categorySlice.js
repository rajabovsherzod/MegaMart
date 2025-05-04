import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    categories: [],
    error: null,
};

export const categoriesSlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategoriesStart: state => {
            state.isLoading = true
        },
        getCategoriesSuccess: (state, { payload}) => {
            state.isLoading = false
            state.categories = payload
        },
        getCategoriesFailure: (state, { payload}) => {
            state.isLoading = false
            state.error = payload
        }
    }
})

export const { getCategoriesStart, getCategoriesSuccess, getCategoriesFailure } = categoriesSlice.actions
export default categoriesSlice.reducer