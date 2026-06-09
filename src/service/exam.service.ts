import api from "./interceptor";

export const enrolledExamCheck = async () => {
  const response = await api.get("/exam/student/current");

  return response.data;
};

export const getExamQuestions = async (examId: string) => {
  const response = await api.get(`/exam/${examId}/questions`);

  return response.data;
};
