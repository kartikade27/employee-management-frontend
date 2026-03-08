import axiosInstance from "../api/axiosConfig";

export const createDepartment = (department) =>
  axiosInstance.post("/departments/createDepartment", department);

export const getDepartmentById = (departmentId) =>
  axiosInstance.get(`/departments/getDepartment/${departmentId}`);

export const getAllDepartments = () =>
  axiosInstance.get("/departments/getAllDepartments");

export const searchDepartment = (name) =>
  axiosInstance.get("/departments/searchDepartment", {
    params: { name: name },
  });

export const updateDepartment = (department, departmentId) =>
  axiosInstance.put(
    `/departments/updateDepartment/${departmentId}`,
    department,
  );

export const deleteDepartment =  (departmentId) =>
  axiosInstance.delete(`/departments/deleteDepartment/${departmentId}`);
