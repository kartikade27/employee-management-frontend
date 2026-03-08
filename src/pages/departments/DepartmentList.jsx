import React, { useState } from "react";
import ActionButtons from "../common/ActionButtons";
import ViewDepartmentModal from "./ViewDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";
import DeleteDepartmentModal from "./DeleteDepartmentModal";

const DepartmentList = ({ departments, loading, refreshDepartments }) => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-card">
        <table className="table w-full rounded-xl border border-gray-200 text-text">
          <thead className="bg-card">
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept, i) => (
              <tr
                key={dept.departmentId}
                className="hover:bg-gray-50 transition"
              >
                <td>{i + 1}</td>

                <td className="font-semibold">{dept.departmentName}</td>

                <td>{dept.description || "—"}</td>

                <td className="text-center">
                  <ActionButtons
                    onView={() => {
                      setSelectedDept(dept);
                      setViewOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedDept(dept);
                      setEditOpen(true);
                    }}
                    onDelete={() => {
                      setSelectedDept(dept);
                      setDeleteOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {departments.map((dept) => (
          <div
            key={dept.departmentId}
            className="card bg-card shadow rounded-xl p-4 transition hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-text">
                  {dept.departmentName}
                </h3>

                <p className="text-sm text-text/60">
                  {dept.description || "—"}
                </p>
              </div>

              <ActionButtons
                vertical
                onView={() => {
                  setSelectedDept(dept);
                  setViewOpen(true);
                }}
                onEdit={() => {
                  setSelectedDept(dept);
                  setEditOpen(true);
                }}
                onDelete={() => {
                  setSelectedDept(dept);
                  setDeleteOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ViewDepartmentModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        department={selectedDept}
      />

      <EditDepartmentModal
        open={editOpen}
        onOpenChange={setEditOpen}
        department={selectedDept}
        onUpdated={refreshDepartments}
      />

      <DeleteDepartmentModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        department={selectedDept}
        onDeleted={refreshDepartments}
      />
    </>
  );
};

export default DepartmentList;
