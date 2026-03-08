import axiosInstance from "../api/axiosConfig";

export const markAttendance = (request) =>
  axiosInstance.post("/attendances/markAttendance", request);

export const getAttendanceByEmployee = (employeeId) =>
  axiosInstance.get(`/attendances/getAttendanceByEmployee/${employeeId}`);

export const getAttendanceByDate = (date) =>
  axiosInstance.get(`/attendances/getAttendanceByDate`, {
    params: { date },
  });

export const getAttendanceEmployeeAndDate = (employeeId, date) =>
  axiosInstance.get(`/attendances/getAttendanceEmployeeAndDate/${employeeId}`, {
    params: { date: date },
  });

export const checkOut = (employeeId) =>
  axiosInstance.patch(`/attendances/checkout/${employeeId}`);
