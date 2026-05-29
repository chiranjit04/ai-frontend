import axios from "axios";

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

export default api;