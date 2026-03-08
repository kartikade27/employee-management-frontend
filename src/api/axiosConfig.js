
import axios from "axios";
import {
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  saveAuthData,
} from "../utils/tokenService";

const axiosInstance = axios.create({
  baseURL: "https://employee-management-system-k5eb.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptors
axiosInstance.interceptors.request.use(async (config) => {
  let token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor (auto refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const res = await axios.post(
          "http://localhost:8080/api/auth/refreshToken?token=" + refreshToken,
        );
        saveAuthData(res.data);
        originalRequest.headers.Authorization = `Bearer ${res.data.getAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        clearAuthData();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
