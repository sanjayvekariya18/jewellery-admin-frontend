import { createSlice } from "@reduxjs/toolkit";
// this is for the demo purpose don't use this slice methods

export const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    handleLogin: (state, action) => {
      let tempState = {
        ...state,
        ...action.payload,
      }

      // window.localStorage.setItem(appConfig.localStorage.token, action.payload.token);
      return tempState
    },
    handleLogout: (state, action) => {
      // window.localStorage.removeItem(appConfig.localStorage.token);
      // window.location.href = ROUTES.LOGIN
      return { ...state }
    },
  },
});

export default authSlice.reducer;
export const {
  handleLogin,
  handleLogout,
} = authSlice.actions;
