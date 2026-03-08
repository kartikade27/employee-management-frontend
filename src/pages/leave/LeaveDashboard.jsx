import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ApplyLeaveForm from "./ApplyLeaveForm";
import LeavesByEmployee from "./LeavesByEmployee";
import { FaCalendarCheck } from "react-icons/fa";

const LeaveDashboard = () => {
  const { user, getLoggedEmployeeId } = useContext(AuthContext);
  const role = user?.role;

  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshLeaves = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 px-2 md:px-0">

      {/* Header */}
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FaCalendarCheck size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Leave Management</h2>
              <p className="text-sm opacity-70">
                Manage employee leave requests
              </p>
            </div>
          </div>

          {/* Apply Leave Button (Employee only) */}
          {role === "EMPLOYEE" && (
            <button
              className="btn btn-primary w-full md:w-auto"
              onClick={() => setOpen(true)}
            >
              Apply Leave
            </button>
          )}

        </div>
      </div>

      {/* Apply Leave Modal */}
      <div className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box max-w-xl w-full">

          <button
            className="btn btn-sm btn-circle absolute right-3 top-3"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          <h3 className="font-semibold text-lg mb-4">
            Apply Leave
          </h3>

          <ApplyLeaveForm
            employeeId={getLoggedEmployeeId()}
            onSuccess={() => {
              setOpen(false);
              refreshLeaves();
            }}
          />

        </div>

        <label
          className="modal-backdrop"
          onClick={() => setOpen(false)}
        ></label>
      </div>

      {/* Leaves Table */}
      <div className="w-full">
        <LeavesByEmployee
          refreshKey={refreshKey}
          onStatusChange={refreshLeaves}
        />
      </div>

    </div>
  );
};

export default LeaveDashboard;