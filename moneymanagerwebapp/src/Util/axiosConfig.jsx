import axios from "axios";
import { BASE_URL } from "./apiEndpoints";


// Create axios instance with base URL and default headers
const axiosConfig = axios.create({
  baseURL: BASE_URL, // Backend base URL
  headers: {
    "Content-Type": "application/json", // Sending data as JSON
    Accept: "application/json", // Expecting JSON response
  },
});

// Endpoints that do not require auth token
const excludeEndPoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request interceptor: runs before every request
axiosConfig.interceptors.request.use(
  (config) => {
    // Check if endpoint is excluded
    const shouldSkipToken = excludeEndPoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // If not excluded, attach JWT token to header
    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // Always return config to continue the request
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor: runs after response or on error
axiosConfig.interceptors.response.use(
  (response) => {
    // Return response if successful (2xx)
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Unauthorized (token expired or invalid)
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      // Server error
      else if (error.response.status === 500) {
        console.error("Server error, please try again later");
      }
    }
    // Handle timeout errors
    else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again");
    }

    // Always reject to allow caller to handle it too
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default axiosConfig;
