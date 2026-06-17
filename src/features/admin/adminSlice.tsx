import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  tutors: any[];
  loading: boolean;
}

const initialState: AdminState = {
  tutors: [],
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    setTutors: (
      state,
      action
    ) => {

      state.tutors =
        action.payload;
    },

    setLoading: (
      state,
      action
    ) => {

      state.loading =
        action.payload;
    },
  },
});

export const {
  setTutors,
  setLoading,
} = adminSlice.actions;

export default adminSlice.reducer;