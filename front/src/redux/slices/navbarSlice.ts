import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = true;

export const navbarSlice = createSlice({
  name: "showNavbar",
  initialState,
  reducers: {
    setShowNavbar: (state, action: PayloadAction<boolean>) => action.payload,
  },
});

export const { setShowNavbar } = navbarSlice.actions;

export default navbarSlice.reducer;
