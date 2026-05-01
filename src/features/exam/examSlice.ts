import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { questions } from "./examData";

interface ExamState {
  currentIndex: number;
  answers: Record<number, string>;
}

const initialState: ExamState = {
  currentIndex: 0,
  answers: {},
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    selectAnswer: (
      state,
      action: PayloadAction<{ questionId: number; answer: string }>
    ) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },

    prevQuestion: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },

    nextQuestion: (state) => {
      if (state.currentIndex < questions.length - 1) {
        state.currentIndex += 1;
      }
    },

    resetExam: (state) => {
      state.currentIndex = 0;
      state.answers = {};
    },
  },
});

export const { selectAnswer, prevQuestion, nextQuestion, resetExam } = examSlice.actions;
export default examSlice.reducer;