import React from "react";
import ActionButtons from "../common/ActionButtons";

const EmployeeList = ({ employees = [], onView, onEdit, onDelete }) => {
  if (!employees.length)
    return (
      <div className="text-center py-10 text-base-content/60">
        No employees found
      </div>
    );

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full rounded-xl border border-gray-200 text-text">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.employeeId}
                className="bg-card hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {emp.firstName} {emp.lastName}
                </td>

                <td className="px-4 py-3">{emp.email}</td>

                <td className="px-4 py-3">{emp.departmentName || "-"}</td>

                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      emp.status === "ACTIVE"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <ActionButtons
                    onView={() => onView(emp.employeeId)}
                    onEdit={() => onEdit(emp.employeeId)}
                    onDelete={() => onDelete(emp)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {employees.map((emp) => (
          <div
            key={emp.employeeId}
            className="card bg-card shadow-md rounded-xl p-4 hover:shadow-lg transition transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-text">
                  {emp.firstName} {emp.lastName}
                </h3>

                <p className="text-sm text-text/60">{emp.email}</p>

                <p className="text-sm text-text/60">
                  {emp.departmentName || "-"}
                </p>

                <span
                  className={`badge mt-2 ${
                    emp.status === "ACTIVE"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <ActionButtons
                vertical
                onView={() => onView(emp.employeeId)}
                onEdit={() => onEdit(emp.employeeId)}
                onDelete={() => onDelete(emp)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeList;