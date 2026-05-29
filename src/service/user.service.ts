import api from "./interceptor";

export const getStudents =
  async () => {
    const response = await api.get(
      "/users/students"
    );

    return response.data;
  };

  export const registerUser =
  async (payload: unknown) => {
    const response =
      await api.post(
        "/auth/register",
        payload
      );

    return response.data;
  };

  export const listOfExams = 
  async () => {
    const response = await api.get(
      "/exam/listOfExams"
    );
    return response.data;
  };

  export const createExam = 
  async (payload: unknown) => {
    const response = await api.post(
      "/exam/create",
      payload
    );
    return response.data;
  };

  export const deleteExam =
  async (
    examId: string
  ) => {

    const response =
      await api.delete(
        `/exam/${examId}`
      );

    return response.data;
  };