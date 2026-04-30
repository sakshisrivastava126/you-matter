import axios from "axios";

/**
 * Axios instance pre-configured with the backend base URL.
 * The JWT token is injected from localStorage on every request via interceptor.
 * withCredentials is intentionally NOT set — we use Bearer token via Authorization header,
 * not cookies, to avoid CORS preflight conflicts with the backend's wildcard origin policy.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject token from localStorage into Authorization header
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("you-matter-token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
