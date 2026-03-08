import React from "react";
import { Building2, FileText } from "lucide-react";

const ViewDepartmentModal = ({ open, onOpenChange, department }) => {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl p-0 bg-card rounded-xl shadow-lg transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-200 bg-primary/10 text-primary rounded-t-xl">
          <Building2 size={20} />
          <h3 className="text-lg font-bold">Department Details</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {department ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card bg-base-100 dark:bg-base-200 shadow rounded-lg">
                <div className="card-body">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Building2 size={16} /> Department Name
                  </h4>
                  <p>{department.departmentName}</p>
                </div>
              </div>
              <div className="card bg-base-100 dark:bg-base-200 shadow rounded-lg">
                <div className="card-body">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText size={16} /> Description
                  </h4>
                  <p>{department.description || "No description"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No department data</p>
          )}
        </div>

        <div className="modal-action px-6 pb-6">
          <button
            className="btn btn-outline w-full hover:bg-gray-100 transition"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartmentModal;
