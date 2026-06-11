import axios from "axios";
import { toast }
  from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// REQUEST INTERCEPTOR

api.interceptors.request.use(
  (config) => {
    // GET USER FROM LOCAL STORAGE

    const user = JSON.parse(
      localStorage.getItem("user") ||
        "null"
    );

    // ATTACH TOKEN

    if (user?.token) {
      config.headers.Authorization =
        `Bearer ${user.token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  (error) => {

    const message =
      error?.response?.data?.error ||
      "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;