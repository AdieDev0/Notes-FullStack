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
    console.log("Token from localStorage:", accessToken);  // Debugging line to check if token is fetched correctly
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;  // Attach token in Authorization header
    }
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request error:", error); // Debugging line to log errors
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle errors globally (if you want to handle API errors in one place)
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // If no error, just return the response
  },
  (error) => {
    // You can check the response status here, e.g. for token expiration handling
    if (error.response) {
      // Example: Handle token expiration
      if (error.response.status === 401) {
        console.error("Token expired or unauthorized. Please log in again.");
      } else {
        console.error("API Error:", error.response.data);
      }
    } else {
      // Handle network or other types of errors
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);  // Propagate the error for further handling
  }
);

export default axiosInstance;
