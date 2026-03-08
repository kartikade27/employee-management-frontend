import React, { useEffect, useState } from "react";
import { getLeavesByStatus } from "../../service/leaveRequestService";
import toast from "react-hot-toast";

const statuses = ["PENDING", "APPROVED", "REJECTED"];

const LeavesByStatus = ({ refreshKey }) => {

  const [status, setStatus] = useState("PENDING");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const res = await getLeavesByStatus(status);

      setLeaves(res.data || []);
    } catch {
      toast.error("Failed loading leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [status, refreshKey]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Leaves by Status
        </h2>

        <select
          className="select select-bordered"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

      </div>

      <div className="overflow-x-auto bg-base-100 shadow rounded-xl">

        <table className="table">

          <thead className="bg-base-200">
            <tr>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Leave Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {leaves.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No leaves found
                </td>
              </tr>
            )}

            {leaves.map((l) => (
              <tr key={l.leaveId} className="hover">

                <td className="font-medium">
                  {l.employeeName}
                </td>

                <td>{formatDate(l.startDate)}</td>

                <td>{formatDate(l.endDate)}</td>

                <td>{l.leaveType}</td>

                <td>
                  <span
                    className={`badge ${
                      l.status === "APPROVED"
                        ? "badge-success"
                        : l.status === "REJECTED"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default LeavesByStatus;