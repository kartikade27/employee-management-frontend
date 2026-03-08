import axiosInstance from "../api/axiosConfig";

export const createEmployee = (employee) =>
  axiosInstance.post("/employees/createEmployee", employee);

export const getEmployeeById = (employeeId) =>
  axiosInstance.get(`/employees/getEmployeeById/${employeeId}`);

export const getAllEmployees = () =>
  axiosInstance.get(`/employees/getAllEmployee`);

export const getEmployeeByStatus = (status) =>
  axiosInstance.get("/employees/getEmployeeByStatus", {
    params: { status: status },
  });

export const searchEmployeeByFirstName = (firstName) =>
  axiosInstance.get("/employees/searchEmployee", {
    params: { firstName: firstName },
  });

export const searchEmployeeByDesignation = (designation) =>
  axiosInstance.get("/employees/searchEmployeeByDesignation", {
    params: { designation: designation },
  });

export const updateEmployee = (employeeId, employee) =>
  axiosInstance.put(`/employees/updateEmployee/${employeeId}`, employee);

export const deleteEmployee = (employeeId) =>
  axiosInstance.delete(`/employees/deleteEmployee/${employeeId}`);

export const updateEmployeeStatus = (employeeId, status) =>
  axiosInstance.patch(`/employees/updateEmployeeStatus/${employeeId}`, null, {
    params: { status: status },
  });

export const findByDepartmentsByEmployee = (departmentId) =>
  axiosInstance.get(`/employees/findByDepartmentsByEmployee/${departmentId}`);
