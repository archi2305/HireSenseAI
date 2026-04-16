import axios from "axios";

const readEnv = (key) => {
  if (typeof import.meta !== "undefined" && import.meta?.env?.[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key];
  }
  return undefined;
};

export const API_BASE_URL =
  readEnv("VITE_API_URL") ||
  readEnv("NEXT_PUBLIC_API_URL") ||
  "http://localhost:8000";

export const AUTH_BASE_URL = API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage = "Server not reachable";
    } else if (error.response.status >= 500) {
      error.userMessage = "Server not reachable";
    } else if (error.response.status === 401) {
      error.userMessage = "Auth failed";
    } else if (error.response.status === 503) {
      error.userMessage = "Missing configuration";
    }
    return Promise.reject(error);
  }
);

export default api;
