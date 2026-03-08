import React, { useState } from "react";
import MarkAttendance from "./MarkAttendance";
import CheckOut from "./CheckOut";
import EmployeeAttendanceView from "./EmployeeAttendanceView";

import { FaCheckCircle, FaSignOutAlt, FaList } from "react-icons/fa";
import { Users } from "lucide-react";

const EmployeeAttendance = () => {
  const [view, setView] = useState("mark");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-100 shadow-md border border-base-200 rounded-xl">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-2x font-semibold">Employee Attendance</h2>
              <p className="text-sm text-base-content/70">
                Manage attendance actions and records
              </p>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <button
              onClick={() => setView("mark")}
              className={`btn btn-sm gap-2 ${
                view === "mark" ? "btn-primary" : "btn-ghost"
              }`}
            >
              <FaCheckCircle />
              Mark
            </button>

            <button
              onClick={() => setView("checkout")}
              className={`btn btn-sm gap-2 ${
                view === "checkout" ? "btn-warning" : "btn-ghost"
              }`}
            >
              <FaSignOutAlt />
              Checkout
            </button>

            <button
              onClick={() => setView("records")}
              className={`btn btn-sm gap-2 ${
                view === "records" ? "btn-accent" : "btn-ghost"
              }`}
            >
              <FaList />
              Records
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card bg-base-100 shadow-md border border-base-200 rounded-xl">
        <div className="card-body p-4 md:p-6">
          {view === "mark" && <MarkAttendance noMinHeight />}
          {view === "checkout" && <CheckOut />}
          {view === "records" && <EmployeeAttendanceView />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
