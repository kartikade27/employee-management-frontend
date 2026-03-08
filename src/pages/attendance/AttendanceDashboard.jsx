import React, { useContext, useState, useEffect } from "react";
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
import toast from "react-hot-toast";
import { Users, Filter, RefreshCcw, Search } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const AttendanceDashboard = () => {
  const { user, getLoggedEmployeeId } = useContext(AuthContext);

  const [allEmployees, setAllEmployees] = useState([]);
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (["ADMIN", "HR"].includes(user.role)) {
      getAllEmployees()
        .then((res) => setAllEmployees(res.data || []))
        .catch(() => toast.error("Failed to fetch employees"));
    }
  }, [user.role]);

  const fetchAttendance = async () => {
    setLoading(true);

    try {
      if (["ADMIN", "HR"].includes(user.role)) {
        if (filterEmployeeId && filterDate) {
          const res = await getAttendanceEmployeeAndDate(
            filterEmployeeId,
            filterDate
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
            })
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
          }))
        );
      }

      setCurrentPage(1);
    } catch {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user, filterEmployeeId, filterDate]);

  const attendanceCards = attendance
    .map((att) => ({
      ...att,
      formattedDate: new Date(att.date).toLocaleDateString(),
    }))
    .filter((att) =>
      att.employeeName.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(attendanceCards.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedAttendance = attendanceCards.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-card shadow-sm border border-base-200  rounded-xl">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">
                Attendance Dashboard
              </h2>

              <p className="text-sm text-text/60">
                Track employee attendance
              </p>
            </div>
          </div>

          <button
            className="btn btn-outline btn-primary gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      

      {/* Filters */}
      {showFilters && (
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
              className="btn btn-primary gap-2"
              onClick={fetchAttendance}
              disabled={loading}
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : paginatedAttendance.length > 0 ? (
          paginatedAttendance.map((att) => (
            <div
              key={att.attendanceId}
              className="card bg-card shadow-md rounded-xl p-4"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{att.employeeName}</h3>

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

              <p className="text-sm mt-2">Date: {att.formattedDate}</p>
              <p className="text-sm">Check In: {att.checkIn || "-"}</p>
              <p className="text-sm">Check Out: {att.checkOut || "-"}</p>
            </div>
          ))
        ) : (
          <p className="text-center py-6 opacity-60">
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
            {paginatedAttendance.map((att) => (
              <tr
                key={att.attendanceId}
                className="bg-card hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {att.employeeName}
                </td>

                <td className="px-4 py-3">
                  {att.formattedDate}
                </td>

                <td className="px-4 py-3">
                  {att.checkIn || "-"}
                </td>

                <td className="px-4 py-3">
                  {att.checkOut || "-"}
                </td>

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
            ))}
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
                  : "btn-outline"
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

export default AttendanceDashboard;