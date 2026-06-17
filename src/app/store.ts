import { configureStore } from "@reduxjs/toolkit";
import chatReducerBot from "../features/chat/chatSlice";
import examReducer from "../features/exam/examSlice";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducerBot,
    exam: examReducer,
    auth: authReducer,
    admin: adminReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;