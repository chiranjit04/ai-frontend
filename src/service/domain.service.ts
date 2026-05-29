import api from "./interceptor";

export const getDomains =
  async () => {
    const response = await api.get(
      "/domains"
    );

    return response.data;
  };