// linksByRole.js
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaFileAlt,
} from "react-icons/fa";

const linksByRole = {
  ADMIN: [
    { path: "/admin", label: "Dashboard", icon: <FaHome className="h-5 w-5 mr-3" /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers className="h-5 w-5 mr-3" /> },
    { path: "/admin/departments", label: "Departments", icon: <FaBuilding className="h-5 w-5 mr-3" /> },
    { path: "/admin/employees", label: "Employees", icon: <FaUsers className="h-5 w-5 mr-3" /> },
    { path: "/admin/attendance", label: "Attendance", icon: <FaCalendarCheck className="h-5 w-5 mr-3" /> },
    { path: "/admin/leave-request", label: "Leave Requests", icon: <FaClipboardList className="h-5 w-5 mr-3" /> },
    { path: "/admin/salary", label: "Salary", icon: <FaMoneyCheckAlt className="h-5 w-5 mr-3" /> },
    { path: "/admin/documents", label: "Documents", icon: <FaFileAlt className="h-5 w-5 mr-3" /> },
  ],

  HR: [
    { path: "/hr", label: "Dashboard", icon: <FaHome className="h-5 w-5 mr-3" /> },
    { path: "/hr/employees", label: "Employee ", icon: <FaUsers className="h-5 w-5 mr-3" /> },
    { path: "/hr/attendance", label: "Attendance", icon: <FaCalendarCheck className="h-5 w-5 mr-3" /> },
    { path: "/hr/leave-request", label: "Leave Requests", icon: <FaClipboardList className="h-5 w-5 mr-3" /> },
    { path: "/hr/salary", label: "Salary", icon: <FaMoneyCheckAlt className="h-5 w-5 mr-3" /> },
    { path: "/hr/documents", label: "Documents", icon: <FaFileAlt className="h-5 w-5 mr-3" /> },
  ],

  EMPLOYEE: [
    { path: "/employee/attendance", label: "My Attendance", icon: <FaCalendarCheck className="h-5 w-5 mr-3" /> },
    { path: "/employee/my-leaves", label: "My Leave", icon: <FaClipboardList className="h-5 w-5 mr-3" /> },
    { path: "/employee/my-salary", label: "My Salary", icon: <FaMoneyCheckAlt className="h-5 w-5 mr-3" /> },
    { path: "/employee/my-documents", label: "My Documents", icon: <FaFileAlt className="h-5 w-5 mr-3" /> },
  ],
};

export default linksByRole;