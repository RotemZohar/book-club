import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  _id: string;
  name: string;
  email: string;
}

const initialState: UserState = {
  _id: "",
  name: "",
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUser: (state, action: PayloadAction<UserState>) => ({
      _id: action.payload._id,
      name: action.payload.name,
      email: action.payload.email,
    }),
  },
});

export const { setUserEmail, setUser, setUserId, setUsername } =
  userSlice.actions;

export default userSlice.reducer;
