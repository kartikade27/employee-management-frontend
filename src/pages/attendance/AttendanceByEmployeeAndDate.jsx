import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { getAttendanceEmployeeAndDate } from "../../service/AttendanceService";
import { getAllEmployees } from "../../service/EmployeeService";
import { AuthContext } from "../../context/AuthContext";
import { User, Search } from "lucide-react";

const AttendanceByEmployeeAndDate = () => {
  const { user } = useContext(AuthContext);

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!["ADMIN", "HR"].includes(user.role)) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="alert alert-error w-fit shadow-lg">Access Denied</div>
      </div>
    );
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployees();
        setEmployees(res.data || []);
      } catch {
        toast.error("Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleFetchAttendance = async () => {
    if (!employeeId || !date) return toast.error("Select employee and date");
    setLoading(true);
    try {
      const res = await getAttendanceEmployeeAndDate(employeeId, date);
      setAttendance(res.data || null);
      if (!res.data) toast("No record found");
    } catch {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const attendanceCard = attendance
    ? {
        ...attendance,
        formattedDate: new Date(attendance.date).toLocaleDateString(),
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-100 shadow-md rounded-xl border border-base-200">
        <div className="card-body flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Attendance By Employee</h2>
              <p className="text-sm text-base-content/60">
                Search employee attendance by date
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select
              className="select select-bordered w-full sm:w-52"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="input input-bordered w-full sm:w-44"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              className="btn btn-primary gap-2 w-full sm:w-auto"
              onClick={handleFetchAttendance}
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              <Search size={16} />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="card bg-base-100 shadow-md rounded-xl border border-base-200">
        <div className="card-body">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : attendanceCard ? (
            <>
              {/* Mobile */}
              <div className="md:hidden">
                <div className="card bg-base-200 shadow-md rounded-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {attendanceCard.employeeName}
                      </h3>
                      <span
                        className={`badge ${
                          attendanceCard.status === "Present"
                            ? "badge-success"
                            : attendanceCard.status === "Absent"
                              ? "badge-error"
                              : "badge-warning"
                        }`}
                      >
                        {attendanceCard.status}
                      </span>
                    </div>
                    <p className="text-sm">
                      Date: {attendanceCard.formattedDate}
                    </p>
                    <p className="text-sm">
                      Check In: {attendanceCard.checkIn || "-"}
                    </p>
                    <p className="text-sm">
                      Check Out: {attendanceCard.checkOut || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{attendanceCard.employeeName}</td>
                      <td>{attendanceCard.formattedDate}</td>
                      <td>{attendanceCard.checkIn || "-"}</td>
                      <td>{attendanceCard.checkOut || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            attendanceCard.status === "Present"
                              ? "badge-success"
                              : attendanceCard.status === "Absent"
                                ? "badge-error"
                                : "badge-warning"
                          }`}
                        >
                          {attendanceCard.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-base-content/60 py-6">
              {employeeId && date
                ? "No attendance record found"
                : "Select employee & date"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceByEmployeeAndDate;
