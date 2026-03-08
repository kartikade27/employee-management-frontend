import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllEmployees,
  getEmployeeById,
} from "../../service/EmployeeService";
import {
  getAttendanceByEmployee,
  getAttendanceByDate,
  getAttendanceEmployeeAndDate,
} from "../../service/AttendanceService";

const ITEMS_PER_PAGE = 5;

const EmployeeAttendanceView = () => {
  const { user, getLoggedEmployeeId } = useContext(AuthContext);

  const [allEmployees, setAllEmployees] = useState([]);
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (["ADMIN", "HR"].includes(user.role)) {
      getAllEmployees()
        .then((res) => setAllEmployees(res.data || []))
        .catch(() => toast.error("Failed to fetch employees"));
    }
  }, [user.role]);

  useEffect(() => {
    fetchAttendance();
  }, [user, filterEmployeeId, filterDate]);

  const fetchAttendance = async () => {
    setLoading(true);

    try {
      if (["ADMIN", "HR"].includes(user.role)) {
        if (filterEmployeeId && filterDate) {
          const res = await getAttendanceEmployeeAndDate(
            filterEmployeeId,
            filterDate,
          );

          setAttendance(res.data ? [res.data] : []);
        } else if (filterDate) {
          const res = await getAttendanceByDate(filterDate);
          setAttendance(res.data || []);
        } else {
          const empRes = await getAllEmployees();

          const allAttendance = await Promise.all(
            (empRes.data || []).map(async (emp) => {
              const res = await getAttendanceByEmployee(emp.employeeId);

              return (res.data || []).map((att) => ({
                employeeName: `${emp.firstName} ${emp.lastName}`,
                ...att,
              }));
            }),
          );

          setAttendance(allAttendance.flat());
        }
      } else {
        const empId = getLoggedEmployeeId();

        const [attRes, empRes] = await Promise.all([
          getAttendanceByEmployee(empId),
          getEmployeeById(empId),
        ]);

        setAttendance(
          (attRes.data || []).map((att) => ({
            employeeName: `${empRes.data.firstName} ${empRes.data.lastName}`,
            ...att,
          })),
        );
      }

      setCurrentPage(1);
    } catch {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const attendanceCards = attendance.map((att) => ({
    ...att,
    formattedDate: new Date(att.date).toLocaleDateString(),
  }));

  const totalPages = Math.ceil(attendanceCards.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedAttendance = attendanceCards.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (!["ADMIN", "HR"].includes(user.role) && !getLoggedEmployeeId()) {
    return <p className="text-center text-error py-10">Access Denied</p>;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {["ADMIN", "HR"].includes(user.role) && (
        <div className="card bg-card shadow-sm rounded-xl">
          <div className="card-body flex flex-col md:flex-row gap-4">
            <select
              className="select select-bordered w-full md:w-64"
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
            >
              <option value="">All Employees</option>

              {allEmployees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="input input-bordered w-full md:w-64"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            <button
              className="btn btn-primary w-full md:w-auto"
              onClick={fetchAttendance}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {paginatedAttendance.length > 0 ? (
          paginatedAttendance.map((att) => (
            <div
              key={att.attendanceId}
              className="card bg-card shadow-md rounded-xl p-4 hover:shadow-lg transition transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-text">
                    {att.employeeName}
                  </h3>
                  <p className="text-sm text-text/60">{att.formattedDate}</p>
                </div>

                <span
                  className={`badge ${
                    att.status === "Present"
                      ? "badge-success"
                      : att.status === "Absent"
                        ? "badge-error"
                        : "badge-warning"
                  }`}
                >
                  {att.status}
                </span>
              </div>

              <div className="flex gap-4 mt-3 text-sm text-text/70">
                <p>Check In: {att.checkIn || "-"}</p>
                <p>Check Out: {att.checkOut || "-"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center opacity-60 py-6">
            No attendance records found
          </p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full rounded-xl border border-gray-200 text-text">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Check In</th>
              <th className="px-4 py-2">Check Out</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAttendance.length > 0 ? (
              paginatedAttendance.map((att) => (
                <tr
                  key={att.attendanceId}
                  className="bg-card hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{att.employeeName}</td>

                  <td className="px-4 py-3">{att.formattedDate}</td>

                  <td className="px-4 py-3">{att.checkIn || "-"}</td>

                  <td className="px-4 py-3">{att.checkOut || "-"}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        att.status === "Present"
                          ? "badge-success"
                          : att.status === "Absent"
                            ? "badge-error"
                            : "badge-warning"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-base-content/60"
                >
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1
                  ? "btn-primary text-white"
                  : "btn-outline text-text"
              } hover:scale-105`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendanceView;
