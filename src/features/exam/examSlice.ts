import { createSlice } from "@reduxjs/toolkit";

interface ExamState {
  currentIndex: number;
  answers: Record<number, string>;

  exam: any | null;

  questions: any[];

  loading: boolean;
  score: number;
}

const initialState: ExamState = {
  currentIndex: 0,
  score: 0,
  answers: {},

  exam: null,

  questions: [],

  loading: false,
};

const examSlice = createSlice({
  name: "exam",

  initialState,

  reducers: {
    setExam: (state, action: PayloadAction<any>) => {
      state.exam = action.payload;
    },

    setQuestions: (state, action: PayloadAction<any[]>) => {
      state.questions = action.payload;
    },

    selectAnswer: (
      state,
      action: PayloadAction<{
        questionId: number;
        answer: string;
      }>,
    ) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },

    prevQuestion: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },

    nextQuestion: (state) => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
      }
    },

    resetExam: (state) => {
      state.currentIndex = 0;

      state.answers = {};

      state.exam = null;

      state.questions = [];

      state.score = 0;
    },
  },
});

export const {
  setExam,
  setQuestions,
  selectAnswer,
  prevQuestion,
  nextQuestion,
  resetExam,
  setScore
} = examSlice.actions;

export default examSlice.reducer;
