import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: () => true,
});

const excludeEndPoints = ["/login", "/register", "/status", "/activate", "/health"];

axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndPoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!shouldSkipToken) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => {
    const originalUrl = response.config.url;

    // LOGIN API: return ALL errors (401 + 403) to catch block
    if (
      originalUrl.includes("/login") &&
      (response.status === 401 || response.status === 403)
    ) {
      return Promise.reject({ response });
    }

    // OTHER APIs – redirect on 401
    if (response.status === 401) {
      window.location.href = "/login";
    }

    return response;
  },
  (error) => Promise.reject(error.response || error)
);

export default axiosConfig;
