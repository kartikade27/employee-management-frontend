import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginForm from "./pages/auth/LoginForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Users from "./pages/users/Users";
import DepartmentsMain from "./pages/departments/DepartmentsMain";
import Employees from "./pages/employee/Employees";
import AttendanceDashboard from "./pages/attendance/AttendanceDashboard";
import LeaveDashboard from "./pages/leave/LeaveDashboard";
import SalaryDashboard from "./pages/salary/SalaryDashboard";
import DocumentsDashboard from "./pages/documents/DocumentsDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import EmployeeAttendance from "./pages/attendance/EmployeeAttendance";
import EmployeeProfile from "./pages/users/EmployeeProfile";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      {/* ✅ Global Toast Provider */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* ADMIN routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<DepartmentsMain />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="leave-request" element={<LeaveDashboard />} />
          <Route path="salary" element={<SalaryDashboard />} />
          <Route path="documents" element={<DocumentsDashboard />} />
        </Route>

        {/* HR routes */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HRDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="leave-request" element={<LeaveDashboard />} />
          <Route path="salary" element={<SalaryDashboard />} />
          <Route path="documents" element={<DocumentsDashboard />} />
        </Route>

        {/* Employee routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="attendance" />} />{" "}
          {/* default employee route */}
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="my-leaves" element={<LeaveDashboard />} />
          <Route path="my-salary" element={<SalaryDashboard />} />
          <Route path="my-documents" element={<DocumentsDashboard />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
