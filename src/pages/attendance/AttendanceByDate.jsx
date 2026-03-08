import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getAttendanceByDate } from "../../service/AttendanceService";
import { AuthContext } from "../../context/AuthContext";
import { CalendarDays } from "lucide-react";

const AttendanceByDate = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!["ADMIN", "HR"].includes(user.role)) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="alert alert-error w-fit shadow-lg">Access Denied</div>
      </div>
    );
  }

  const fetchAttendance = async (selectedDate) => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await getAttendanceByDate(selectedDate);
      setAttendance(res.data || []);
      if (!res.data?.length) toast("No records found for this date");
    } catch {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) fetchAttendance(date);
  }, [date]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-100 shadow-md rounded-xl border border-base-200">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Attendance By Date</h2>
              <p className="text-sm text-base-content/60">
                Select date to view attendance records
              </p>
            </div>
          </div>
          <input
            type="date"
            className="input input-bordered w-full md:w-56"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card bg-base-100 shadow-md rounded-xl border border-base-200">
        <div className="card-body p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : attendance.length > 0 ? (
            <div className="overflow-x-auto">
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
                  {attendance.map((att) => (
                    <tr key={att.attendanceId}>
                      <td>{att.employeeName}</td>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>{att.checkIn || "-"}</td>
                      <td>{att.checkOut || "-"}</td>
                      <td>
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
          ) : (
            <p className="text-center text-sm text-base-content/60">
              No attendance records for this date
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceByDate;
