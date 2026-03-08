import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getLeavesByEmployee,
  approveLeave,
  rejectLeave,
} from "../../service/leaveRequestService";
import { getAllEmployees } from "../../service/EmployeeService";
import toast from "react-hot-toast";

const PAGE_SIZE = 5;
const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const LeavesByEmployee = ({ refreshKey, onStatusChange }) => {
  const { user, getLoggedEmployeeId } = useContext(AuthContext);

  const [leaves, setLeaves] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadLeaves = async () => {
    try {
      setLoading(true);

      let allLeaves = [];

      if (user.role === "EMPLOYEE") {
        const res = await getLeavesByEmployee(getLoggedEmployeeId());
        allLeaves = res.data || [];
      } else {
        const employees = await getAllEmployees();

        const leavesArr = await Promise.all(
          employees.data.map((emp) =>
            getLeavesByEmployee(emp.employeeId)
              .then((res) => res.data || [])
              .catch(() => []),
          ),
        );

        allLeaves = leavesArr.flat();
      }

      setLeaves(allLeaves);
    } catch {
      toast.error("Failed loading leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [user, refreshKey]);

  const approve = async (id) => {
    try {
      await approveLeave(id);
      toast.success("Leave Approved");
      onStatusChange();
    } catch {
      toast.error("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await rejectLeave(id);
      toast.success("Leave Rejected");
      onStatusChange();
    } catch {
      toast.error("Reject failed");
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();

  const filteredLeaves =
    status === "ALL"
      ? leaves
      : leaves.filter((l) => l.status?.toUpperCase() === status);

  const totalPages = Math.ceil(filteredLeaves.length / PAGE_SIZE);

  const data = filteredLeaves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h2 className="text-xl font-semibold">Leaves</h2>

        <select
          className="select select-bordered w-full md:w-auto"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block overflow-x-auto bg-card">
        <table className="table w-full border border-gray-200">
          <thead className="bg-card">
            <tr>
              <th>Employee</th>
              <th>Start</th>
              <th>End</th>
              <th>Type</th>
              <th>Status</th>
              {user.role !== "EMPLOYEE" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((l) => {
              const status = l.status?.toUpperCase();

              return (
                <tr key={l.leaveId} className="hover">
                  <td className="font-medium">{l.employeeName}</td>

                  <td>{formatDate(l.startDate)}</td>

                  <td>{formatDate(l.endDate)}</td>

                  <td>{l.leaveType}</td>

                  <td>
                    <span
                      className={`badge ${
                        status === "APPROVED"
                          ? "badge-success"
                          : status === "REJECTED"
                            ? "badge-error"
                            : "badge-warning"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  {user.role !== "EMPLOYEE" && (
                    <td className="flex gap-2">
                      <button
                        className="btn btn-xs btn-success"
                        disabled={status === "APPROVED"}
                        onClick={() => approve(l.leaveId)}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-xs btn-error"
                        disabled={status === "REJECTED"}
                        onClick={() => reject(l.leaveId)}
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}

      <div className="grid gap-4 md:hidden">
        {data.map((l) => {
          const status = l.status?.toUpperCase();

          return (
            <div
              key={l.leaveId}
              className="card bg-base-100 shadow-md rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{l.employeeName}</h3>
                  <p className="text-sm opacity-70">{l.leaveType}</p>
                </div>

                <span
                  className={`badge ${
                    status === "APPROVED"
                      ? "badge-success"
                      : status === "REJECTED"
                        ? "badge-error"
                        : "badge-warning"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-3 text-sm space-y-1">
                <p>
                  <b>Start:</b> {formatDate(l.startDate)}
                </p>

                <p>
                  <b>End:</b> {formatDate(l.endDate)}
                </p>
              </div>

              {user.role !== "EMPLOYEE" && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-success flex-1"
                    disabled={status === "APPROVED"}
                    onClick={() => approve(l.leaveId)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-sm btn-error flex-1"
                    disabled={status === "REJECTED"}
                    onClick={() => reject(l.leaveId)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn btn-sm ${
                page === i + 1 ? "btn-primary" : "btn-outline"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeavesByEmployee;
