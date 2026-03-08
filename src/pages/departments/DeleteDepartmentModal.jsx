import React, { useState } from "react";
import { deleteDepartment } from "../../service/DepartmentService";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const DeleteDepartmentModal = ({
  open,
  onOpenChange,
  department,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting department...");
    try {
      setLoading(true);
      await deleteDepartment(department.departmentId);
      toast.success("Department deleted", { id: toastId });
      onDeleted?.();
      onOpenChange(false);
    } catch {
      toast.error("Delete failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-6 bg-card rounded-xl shadow-lg transition-all">
        <h3 className="font-bold text-lg flex items-center gap-2 text-error">
          <Trash2 size={18} />
          Delete Department
        </h3>
        <p className="py-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{department?.departmentName}</span>?
        </p>

        <div className="flex gap-3 justify-end">
          <button
            className="btn btn-outline flex-1 hover:bg-gray-100 transition"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className="btn flex-1 bg-error text-white hover:bg-error/90 transition"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDepartmentModal;
