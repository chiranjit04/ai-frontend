import api from "./interceptor";

export const deleteStudent = async (studentId: number) => {
  const response = await api.delete(`/users/students/${studentId}`);
  return response.data;
};

export const getTutors = async () => {
  const response = await api.get("/users/teachers");
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};

export const getStudents = async () => {
  const response = await api.get("/users/students");
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

  export const updateExam = async (examId: string, payload: any) => {
    const response = await api.put(`/exam/${examId}`, payload);

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