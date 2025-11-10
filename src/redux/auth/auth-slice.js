import { createSlice } from "@reduxjs/toolkit";
import {
  handleRegistration,
  handleLogin,
  handleLogout,
  getCurrentUser,
  getCalorieIntake,
  getCalorieIntakeForUser,
} from "./auth-operations";

const initialState = {
  userDailyDiet: null,
  dailyDiet: null,
  user: {},
  accessToken: null, // pentru compatibilitate cu persist (dacă vei folosi)
  refreshToken: null, // idem
  registrationStatus: false,
  isLogin: false,
  isLoading: false,
  isError: null,
  showModal: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateModalStatus: (state, { payload }) => {
      state.showModal = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(handleRegistration.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(handleRegistration.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.registrationStatus = true;
        state.isLoading = false;
      })
      .addCase(handleRegistration.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })

      // login
      .addCase(handleLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(handleLogin.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isLogin = true;
        state.isLoading = false;
        state.userDailyDiet = payload.dailyDiet;
      })
      .addCase(handleLogin.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })

      // current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isLogin = true;
        state.isLoading = false;
        state.userDailyDiet = payload.dailyDiet;
      })
      // în extraReducers, în loc de varianta ta actuală de getCurrentUser.rejected:

      .addCase(getCurrentUser.rejected, (state, { payload }) => {
        state.isLoading = false;

        if (payload === null) {
          // 401 / sesiune invalidă => tratăm ca guest, fără eroare vizibilă
          state.isLogin = false;
          state.isError = null;
        } else {
          state.isLogin = false;
          state.isError = payload;
        }
      })

      // logout
      .addCase(handleLogout.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(handleLogout.fulfilled, () => ({ ...initialState }))
      .addCase(handleLogout.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })

      // daily-intake calc
      .addCase(getCalorieIntake.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getCalorieIntake.fulfilled, (state, { payload }) => {
        state.dailyDiet = payload;
        state.isLoading = false;
      })
      .addCase(getCalorieIntake.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })

      // daily-intake for user
      .addCase(getCalorieIntakeForUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getCalorieIntakeForUser.fulfilled, (state, { payload }) => {
        state.userDailyDiet = payload;
        state.isLoading = false;
      })
      .addCase(getCalorieIntakeForUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      });
  },
});

export const { updateModalStatus } = authSlice.actions;
export default authSlice.reducer;
