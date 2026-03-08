import React, { useState } from "react";
import { createDepartment } from "../../service/DepartmentService";
import toast from "react-hot-toast";
import { FaBuilding } from "react-icons/fa";

const CreateDepartmentModal = ({ open, onOpenChange, onCreated }) => {
  const [department, setDepartment] = useState({
    departmentName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating department...");
    try {
      setLoading(true);
      await createDepartment(department);
      toast.success("Department created!", { id: toastId });
      setDepartment({ departmentName: "", description: "" });
      onCreated?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create department", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg p-0 bg-card rounded-xl shadow-lg transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-200">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FaBuilding size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">Create Department</h3>
            <p className="text-sm text-text/60">Add a new department</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label font-medium text-text">
              Department Name
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter department name"
              value={department.departmentName}
              onChange={(e) =>
                setDepartment({ ...department, departmentName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-medium text-text">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Optional description"
              value={department.description}
              onChange={(e) =>
                setDepartment({ ...department, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn btn-outline flex-1 hover:bg-gray-100 transition"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn flex-1 bg-primary text-white hover:bg-primary/90 transition"
            >
              {loading ? "Creating..." : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;
