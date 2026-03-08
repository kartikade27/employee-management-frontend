import axiosInstance from "../api/axiosConfig";

export const applyLeave = (leaveData) =>
  axiosInstance.post("/leavesRequest/applyLeave", leaveData);

export const getLeavesByEmployee = (employeeId) =>
  axiosInstance.get(`/leavesRequest/getLeavesByEmployee/${employeeId}`);

export const getLeavesByStatus = (status) =>
  axiosInstance.get("/leavesRequest/getLeavesByStatus", {
    params: { status: status },
  });

export const approveLeave = (leaveId) =>
  axiosInstance.patch(`/leavesRequest/approveLeave/${leaveId}`);

export const rejectLeave = (leaveId) =>
  axiosInstance.patch(`/leavesRequest/rejectLeave/${leaveId}`);
