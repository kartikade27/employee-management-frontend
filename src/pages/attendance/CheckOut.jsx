import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { checkOut } from "../../service/AttendanceService";
import { AuthContext } from "../../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";

const CheckOut = () => {
  const { getLoggedEmployeeId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckOut = async () => {
    const employeeId = getLoggedEmployeeId();
    if (!employeeId) return toast.error("Employee not logged in!");

    setLoading(true);
    try {
      await checkOut(employeeId);
      toast.success("Checked out successfully!");
      setCheckedOut(true);
    } catch {
      toast.error("Failed to check out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-75 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-md border border-base-200 rounded-xl">
        <div className="card-body text-center space-y-4">
          <h2 className="flex justify-center items-center gap-3 text-xl font-bold text-warning">
            <FaSignOutAlt size={20} />
            Check Out
          </h2>

          <button
            onClick={handleCheckOut}
            disabled={loading || checkedOut}
            className={`btn w-full ${checkedOut ? "btn-outline" : "btn-error"}`}
          >
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {loading
              ? "Checking Out..."
              : checkedOut
                ? "Checked Out"
                : "Check Out"}
          </button>

          {checkedOut && (
            <div className="badge badge-success badge-lg gap-2 mx-auto">
              ✔ You have checked out successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
