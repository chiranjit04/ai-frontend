import api from "./interceptor";

export const submitExam = async (
  examId: string,
  answers: Record<string, string>,
) => {
  const response = await api.post("/exam/submitExam", {
    exam_id: examId,
    answers,
  });

  return response.data;
};

export const enrolledExamCheck = async () => {
  const response = await api.get("/exam/student/current");

  return response.data;
};

export const getExamQuestions = async (examId: string) => {
  const response = await api.get(`/exam/${examId}/questions`);

  return response.data;
};
