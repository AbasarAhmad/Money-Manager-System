import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: () => true, // IMPORTANT: allow axios to read 401 body
});

// Endpoints that don't need token
const excludeEndPoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request Interceptor
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

// Response Interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    const originalUrl = response.config.url;

    // LOGIN API – do NOT redirect on 401, return message to UI
    if (response.status === 401 && originalUrl.includes("/login")) {
      return Promise.reject({ response });

    }

    // OTHER APIs – redirect on 401
    if (response.status === 401) {
      window.location.href = "/login";
    }

    // Return all other responses normally
    return response;
  },
  (error) => {
    // Handle network errors
    return Promise.reject(error.response || error);
  }
);

export default axiosConfig;
