import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface User {
  id: number;

  email: string;

  type:
    | "ADMIN"
    | "TUTOR"
    | "CANDIDATE";

  token: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: JSON.parse(
    localStorage.getItem("user") || "null"
  ),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;

        user: {
          id: number;

          email: string;

          type:
            | "ADMIN"
            | "TUTOR"
            | "CANDIDATE"
            | "Teacher";
        };
      }>
    ) => {
      const payload = {
        ...action.payload.user,

        token: action.payload.token,
      };

      state.user = payload;

      localStorage.setItem(
        "user",
        JSON.stringify(payload)
      );
    },

    logout: (state) => {
      state.user = null;

      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } =
  authSlice.actions;

export default authSlice.reducer;