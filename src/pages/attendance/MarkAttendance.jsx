import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { markAttendance } from "../../service/AttendanceService";
import { AuthContext } from "../../context/AuthContext";
import { FaCheckCircle } from "react-icons/fa";

const MarkAttendance = ({ noMinHeight }) => {
  const { getLoggedEmployeeId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState(false);

  const handleMarkAttendance = async () => {
    const employeeId = getLoggedEmployeeId();
    if (!employeeId) return toast.error("Employee not logged in!");

    setLoading(true);
    try {
      await markAttendance({ employeeId });
      toast.success("Attendance marked successfully!");
      setMarked(true);
    } catch {
      toast.error("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center px-4 py-6 ${
        !noMinHeight ? "min-h-80" : ""
      }`}
    >
      <div className="card w-full max-w-md bg-base-100 shadow-md border border-base-200 hover:shadow-xl rounded-xl">
        <div className="card-body text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-xl bg-primary/10 text-primary text-2xl">
              <FaCheckCircle />
            </div>
            <h2 className="text-xl font-semibold">Mark Attendance</h2>
            <p className="text-sm text-base-content/60">
              Record your daily attendance
            </p>
          </div>

          <button
            onClick={handleMarkAttendance}
            disabled={loading || marked}
            className={`btn w-full gap-2 ${
              marked ? "btn-success btn-outline" : "btn-primary"
            }`}
          >
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {loading
              ? "Marking..."
              : marked
                ? "Attendance Marked"
                : "Mark Attendance"}
          </button>

          {marked && (
            <div className="badge badge-success gap-2 p-3">
              ✔ You have marked attendance today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
