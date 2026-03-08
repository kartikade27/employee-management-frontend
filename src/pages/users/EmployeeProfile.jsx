// src/components/employee/EmployeeProfile.jsx
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getEmployeeById } from "../../service/EmployeeService";
import { AuthContext } from "../../context/AuthContext";
import EmployeeUpdateProfileModal from "./EmployeeUpdateProfileModal";
import {
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaBirthdayCake,
  FaBuilding,
  FaUserTie,
  FaMoneyBill,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";

const EmployeeProfile = () => {
  const { getLoggedEmployeeId } = useContext(AuthContext);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const employeeId = getLoggedEmployeeId();
      if (!employeeId) throw new Error("Employee not logged in!");
      const res = await getEmployeeById(employeeId);
      setEmployee(res.data);
    } catch {
      toast.error("Failed to fetch employee profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [getLoggedEmployeeId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (!employee)
    return (
      <p className="text-center mt-10 text-error text-lg">
        Employee not found.
      </p>
    );

  return (
    <div className="">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ===== Header Card ===== */}
        <div className="card bg-base-100 dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center text-6xl md:text-7xl">
            <FaUserCircle />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-base-content/70 mt-1">{employee.designation}</p>
            <p className="text-base-content/70">{employee.departmentName}</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary rounded-btn px-6 py-2"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ===== Contact & Personal Info ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            label="Email"
            value={employee.email}
            icon={<FaEnvelope />}
          />
          <InfoCard
            label="Phone Number"
            value={employee.phoneNumber || "-"}
            icon={<FaPhone />}
          />
          <InfoCard
            label="Employee ID"
            value={employee.employeeId}
            icon={<FaIdBadge />}
          />
          <InfoCard
            label="Date of Birth"
            value={
              employee.dateOfBirth
                ? new Date(employee.dateOfBirth).toLocaleDateString()
                : "-"
            }
            icon={<FaBirthdayCake />}
          />
        </div>

        {/* ===== Work Info ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            label="Salary"
            value={
              employee.salary ? `₹ ${employee.salary.toLocaleString()}` : "-"
            }
            icon={<FaMoneyBill />}
          />
          <InfoCard
            label="Joining Date"
            value={
              employee.joiningDate
                ? new Date(employee.joiningDate).toLocaleDateString()
                : "-"
            }
            icon={<FaCalendarAlt />}
          />
          <InfoCard
            label="Status"
            value={employee.status || "Active"}
            icon={<FaUserTie />}
          />
          <InfoCard
            label="Gender"
            value={employee.gender || "-"}
            icon={<FaUserTie />}
          />
        </div>
      </div>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start sm:items-center z-50 p-4 overflow-y-auto">
          <div className="bg-base-100 dark:bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg transition-colors duration-300">
            <EmployeeUpdateProfileModal
              employeeId={employee.employeeId}
              onClose={() => setShowModal(false)}
              onSuccess={fetchEmployee}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ===== InfoCard Component =====
const InfoCard = ({ icon, label, value }) => (
  <div className="card bg-base-100 dark:bg-gray-800 shadow rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-colors duration-300">
    <div className="text-2xl text-primary">{icon}</div>
    <div>
      <p className="text-sm text-base-content/70">{label}</p>
      <p className="font-semibold text-base-content">{value || "-"}</p>
    </div>
  </div>
);

export default EmployeeProfile;
