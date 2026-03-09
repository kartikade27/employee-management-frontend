import axios from "axios";
import {
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  saveAuthData,
} from "../utils/tokenService";

const BASE_URL = "https://employee-management-system-k5eb.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor - attach access token
axiosInstance.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor - handle 401 + auto refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token found");

        // Use the live Render URL for refreshToken endpoint
        const res = await axios.post(`${BASE_URL}/auth/refreshToken?token=${refreshToken}`);

        // Save new tokens
        saveAuthData(res.data);

        // Update original request with new access token
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken || res.data.getAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        clearAuthData();
        window.location.href = "/employee-management-system/"; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;