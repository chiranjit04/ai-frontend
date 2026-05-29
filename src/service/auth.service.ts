import api from "./constants";

export const loginUser = async (
  payload: {
    email: string;
    password: string;
  }
) => {
  const response = await api.post(
    "/auth/login",
    payload
  );

  return response.data;
};