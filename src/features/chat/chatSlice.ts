import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Message = {
  role: "user" | "bot";
  text: string;
  fileName?: string;
  file?: File | null;
};

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (formData: FormData) => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      body: formData,
    });
    return res.json();
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => { //pending   → loading start
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => { //fulfilled → success
        state.loading = false;
        state.messages.push({
          role: "bot",
          text: action.payload.reply,
        });
      })
      .addCase(sendMessage.rejected, (state) => { //rejected  → error
        state.loading = false;
        state.error = "Error occurred";
      });
  },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;