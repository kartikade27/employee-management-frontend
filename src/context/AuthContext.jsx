import { createContext, useEffect, useState } from "react";
import {
  getUser,
  getAccessToken,
  saveAuthData,
  clearAuthData,
} from "../utils/tokenService";
import { loginUser } from "../service/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 🔥 important
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUser();

    if (token && storedUser) {
      setUser(storedUser);
      setEmployeeId(storedUser.employeeId);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);
    saveAuthData(res.data);
    setUser(res.data.response);
    setEmployeeId(res.data.response.employeeId);
    setIsAuthenticated(true);
    return res.data.response;
  };

  const getLoggedEmployeeId = () => {
    return employeeId;
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, getLoggedEmployeeId }}
    >
      {children}
    </AuthContext.Provider>
  );
};
