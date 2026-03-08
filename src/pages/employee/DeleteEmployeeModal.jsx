import React, { useState } from "react";
import { deleteEmployee } from "../../service/EmployeeService";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

const DeleteEmployeeModal = ({ open, onClose, employeeId, employeeName, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteEmployee(employeeId);
      toast.success("Employee deleted successfully");
      onDeleted?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md rounded-xl shadow-lg p-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-error/10 text-error">
            <AlertTriangle size={28} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">Delete Employee</h3>

        {/* Description */}
        <p className="text-sm text-base-content/70 mb-1">
          Are you sure you want to delete
        </p>
        <p className="text-center font-semibold mb-2">
          {employeeName || "this employee"}?
        </p>
        <p className="text-xs text-error mb-4">
          This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="btn btn-outline flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn btn-error flex-1 gap-2"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <Trash2 size={16} />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default DeleteEmployeeModal;