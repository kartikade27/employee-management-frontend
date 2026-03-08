import axiosInstance from "../api/axiosConfig";

export const generateSalary = (salaryData) =>
  axiosInstance.post("/salaryPayments/generateSalary", salaryData);

export const getSalaryByEmployee = (employeeId) =>
  axiosInstance.get(`/salaryPayments/getSalaryByEmployee/${employeeId}`);

export const getSalaryByStatus = (status) =>
  axiosInstance.get("/salaryPayments/getSalaryByStatus", {
    params: { status: status },
  });

export const getSalaryByMonth = (monthYear) =>
  axiosInstance.get("/salaryPayments/getSalaryByMonth", {
    params: { monthYear: monthYear },
  });

export const totalSalaryPaid = () =>
  axiosInstance.get("/salaryPayments/totalSalaryPaid");
