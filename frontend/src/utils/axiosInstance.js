import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set timeout to 10 seconds
  headers: {
    "Content-Type": "application/json", // Default header for JSON requests
  },
});

// Request interceptor to add the token if available in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Attach token in Authorization header
    }
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request error:", error); // Debugging line to log errors
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Handle API or network errors
    if (error.response) {
      const status = error.response.status;

      // Example: Handle token expiration or unauthorized access
      if (status === 401) {
        console.error(
          "Unauthorized or token expired. Clearing token and redirecting..."
        );
        localStorage.clear();
        window.location.href = "/login"; // Redirect to login
      } else {
        console.error("API Error:", error.response.data);
      }
    } else {
      // Handle network errors
      console.error("Network error:", error.message);
    }
    return Promise.reject(error); // Propagate the error for further handling
  }
);

export default axiosInstance;
