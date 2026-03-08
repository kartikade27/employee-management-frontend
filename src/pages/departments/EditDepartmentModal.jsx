import React, { useState, useEffect } from "react";
import { updateDepartment } from "../../service/DepartmentService";
import toast from "react-hot-toast";
import { Pencil, Building2, FileText } from "lucide-react";

const EditDepartmentModal = ({ open, onOpenChange, department, onUpdated }) => {
  const [form, setForm] = useState({ departmentName: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setForm({
        departmentName: department.departmentName || "",
        description: department.description || "",
      });
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating department...");
    try {
      setLoading(true);
      await updateDepartment(form, department.departmentId);
      toast.success("Department updated", { id: toastId });
      onUpdated?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg p-0 bg-card rounded-xl shadow-lg transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-200 bg-primary/10 text-primary rounded-t-xl">
          <Pencil size={20} />
          <h3 className="text-lg font-bold">Edit Department</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label font-medium text-text">
              Department Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="input input-bordered w-full pl-9"
                placeholder="Enter department name"
                value={form.departmentName}
                onChange={(e) =>
                  setForm({ ...form, departmentName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label font-medium text-text">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" />
              <textarea
                className="textarea textarea-bordered w-full pl-9"
                rows={4}
                placeholder="Optional description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
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
              {loading ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
