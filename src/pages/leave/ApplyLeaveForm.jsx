import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { applyLeave } from "../../service/leaveRequestService";

const leaveTypes = ["SICK", "CASUAL", "EARNED"];

const ApplyLeaveForm = ({ employeeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeId: employeeId || "",
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, employeeId: employeeId || "" }));
  }, [employeeId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const temp = {};
    if (!formData.startDate) temp.startDate = "Start date required";
    if (!formData.endDate) temp.endDate = "End date required";
    if (!formData.reason) temp.reason = "Reason required";
    if (!formData.leaveType) temp.leaveType = "Leave type required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await applyLeave(formData);
      toast.success("Leave applied successfully");
      setFormData({
        employeeId,
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "",
      });
      onSuccess && onSuccess();
    } catch {
      toast.error("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 dark:bg-gray-800 p-6 md:p-8 rounded-xl space-y-6 shadow-md max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-base-content dark:text-white mb-4">
        Apply Leave
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input input-bordered w-full focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />
          {errors.startDate && (
            <span className="text-error text-xs mt-1">{errors.startDate}</span>
          )}
        </div>

        {/* End Date */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input input-bordered w-full focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />
          {errors.endDate && (
            <span className="text-error text-xs mt-1">{errors.endDate}</span>
          )}
        </div>

        {/* Leave Type */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Leave Type</span>
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="select select-bordered w-full focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.leaveType && (
            <span className="text-error text-xs mt-1">{errors.leaveType}</span>
          )}
        </div>

        {/* Reason */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Reason</span>
          </label>
          <textarea
            rows="4"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />
          {errors.reason && (
            <span className="text-error text-xs mt-1">{errors.reason}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full md:w-auto px-6 py-3 mt-4 ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Applying..." : "Apply Leave"}
      </button>
    </form>
  );
};

export default ApplyLeaveForm;
