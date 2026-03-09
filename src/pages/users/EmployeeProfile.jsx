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

      if (!employeeId) throw new Error("Employee not logged in");

      const res = await getEmployeeById(employeeId);

      setEmployee(res.data);
    } catch {
      toast.error("Failed to fetch employee profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [getLoggedEmployeeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!employee) {
    return (
      <p className="text-center mt-10 text-error text-lg">
        Employee not found.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PROFILE CARD */}
        <div className="card bg-base-100 dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center text-center">

          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-primary text-6xl">
            <FaUserCircle />
          </div>

          <h2 className="text-xl font-bold mt-4">
            {employee.firstName} {employee.lastName}
          </h2>

          <p className="text-base-content/70">{employee.designation}</p>

          <p className="text-base-content/60 text-sm">
            {employee.departmentName}
          </p>

          <div className="divider"></div>

          <div className="space-y-2 text-sm w-full text-left">

            <p className="flex items-center gap-2">
              <FaEnvelope className="text-primary" />
              {employee.email}
            </p>

            <p className="flex items-center gap-2">
              <FaPhone className="text-primary" />
              {employee.phoneNumber || "-"}
            </p>

            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              {employee.joiningDate
                ? new Date(employee.joiningDate).toLocaleDateString()
                : "-"}
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary w-full mt-5"
          >
            Edit Profile
          </button>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PERSONAL INFO */}
          <div className="card bg-base-100 dark:bg-gray-800 shadow rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InfoCard
                icon={<FaIdBadge />}
                label="Employee ID"
                value={employee.employeeId}
              />

              <InfoCard
                icon={<FaBirthdayCake />}
                label="Date of Birth"
                value={
                  employee.dateOfBirth
                    ? new Date(employee.dateOfBirth).toLocaleDateString()
                    : "-"
                }
              />

              <InfoCard
                icon={<FaUserTie />}
                label="Gender"
                value={employee.gender || "-"}
              />

              <InfoCard
                icon={<FaPhone />}
                label="Phone"
                value={employee.phoneNumber || "-"}
              />

            </div>
          </div>

          {/* WORK INFO */}
          <div className="card bg-base-100 dark:bg-gray-800 shadow rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-4">
              Work Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InfoCard
                icon={<FaBuilding />}
                label="Department"
                value={employee.departmentName || "-"}
              />

              <InfoCard
                icon={<FaUserTie />}
                label="Designation"
                value={employee.designation || "-"}
              />

              <InfoCard
                icon={<FaMoneyBill />}
                label="Salary"
                value={
                  employee.salary
                    ? `₹ ${employee.salary.toLocaleString()}`
                    : "-"
                }
              />

              <InfoCard
                icon={<FaUserTie />}
                label="Status"
                value={employee.status || "ACTIVE"}
              />

            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start sm:items-center z-50 p-4 overflow-y-auto">

          <div className="bg-base-100 dark:bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg">

            <EmployeeUpdateProfileModal
              employeeId={getLoggedEmployeeId()}
              onClose={() => setShowModal(false)}
              onSuccess={fetchEmployee}
            />

          </div>

        </div>
      )}
    </div>
  );
};

/* INFO CARD COMPONENT */

const InfoCard = ({ icon, label, value }) => (
  <div className="card bg-base-100 dark:bg-gray-800 shadow rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition">

    <div className="text-2xl text-primary">{icon}</div>

    <div>
      <p className="text-sm text-base-content/70">{label}</p>
      <p className="font-semibold text-base-content">{value || "-"}</p>
    </div>

  </div>
);

export default EmployeeProfile;