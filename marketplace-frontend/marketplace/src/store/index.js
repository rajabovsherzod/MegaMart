import { configureStore } from "@reduxjs/toolkit";
import Authreducer from "../slice/authSlice";
import CategoriesReducer from "../slice/categorySlice";

export const store = configureStore({
    reducer: {
        auth: Authreducer,
        categories: CategoriesReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
})