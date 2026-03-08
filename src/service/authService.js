import axiosInstance from "../api/axiosConfig";

export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);

export const loginUser = (data) => axiosInstance.post("/auth/login", data);

export const activateUser = (userId) =>
  axiosInstance.patch(`/auth/activate-user-account/${userId}`);

export const deactivateUser = (userId) =>
  axiosInstance.patch(`/auth/deactivate-user-account/${userId}`);

export const getAllUsers = () => axiosInstance.get("/auth/findAllUsers");
