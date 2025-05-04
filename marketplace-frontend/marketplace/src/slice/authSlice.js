import { createSlice } from "@reduxjs/toolkit";
import { getItem } from "../helpers/persistance-storage";

const initialState = {
  isLoading: false,
  isLoggedIn: !!getItem("token"),
  user: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUserStart: (state) => {
      state.isLoading = true;
    },
    signUserSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = payload;
    },
    signUserFailure: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    logoutUser: (state) => {
      (state.user = null), (state.isLoggedIn = false);
    },
  },
});

export const { signUserStart, signUserSuccess, signUserFailure, logoutUser } =
  authSlice.actions;

export default authSlice.reducer;
