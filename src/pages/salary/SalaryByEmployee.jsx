import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getSalaryByEmployee,
  getSalaryByStatus,
} from "../../service/salaryPaymentService";
import { getAllEmployees } from "../../service/EmployeeService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

const SalaryByEmployee = ({ refreshTrigger }) => {
  const { user, getLoggedEmployeeId } = useContext(AuthContext);

  const [salary, setSalary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSalary = async () => {
    setLoading(true);

    try {
      let allSalaries = [];

      if (user.role === "EMPLOYEE") {
        const res = await getSalaryByEmployee(getLoggedEmployeeId());
        allSalaries = res.data || [];
      } else {
        if (status !== "ALL") {
          const res = await getSalaryByStatus(status);
          allSalaries = res.data || [];
        } else {
          const employeesRes = await getAllEmployees();

          const salariesArrays = await Promise.all(
            employeesRes.data.map((emp) =>
              getSalaryByEmployee(emp.employeeId)
                .then((res) => res.data || [])
                .catch(() => []),
            ),
          );

          allSalaries = salariesArrays.flat();
        }
      }

      setSalary(allSalaries);
      setCurrentPage(1);
    } catch {
      toast.error("Error fetching salary data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [user, refreshTrigger, status]);

  const totalPages = Math.ceil(salary.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedSalary = salary.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Filter */}

      {(user.role === "HR" || user.role === "ADMIN") && (
        <div className="flex justify-end bg-card card">
          <select
            className="select select-bordered w-80"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      )}

      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full rounded-xl border border-gray-200 text-text">
          <thead className="bg-card">
            <tr>
              {(user.role === "HR" || user.role === "ADMIN") && (
                <th className="px-4 py-2">Employee</th>
              )}
              <th className="px-4 py-2">Month-Year</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSalary.map((s) => (
              <tr
                key={s.paymentId}
                className="bg-card hover:bg-gray-50 transition"
              >
                {(user.role === "HR" || user.role === "ADMIN") && (
                  <td className="px-4 py-3 font-medium">{s.employeeName}</td>
                )}

                <td className="px-4 py-3">{s.monthYear}</td>

                <td className="px-4 py-3 font-semibold">{s.amount}</td>

                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      s.paymentStatus === "PAID"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {s.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}

      <div className="grid gap-4 md:hidden">
        {paginatedSalary.map((s) => (
          <div
            key={s.paymentId}
            className="card bg-card shadow-md rounded-xl p-4 hover:shadow-lg transition transform hover:scale-[1.02]"
          >
            {(user.role === "HR" || user.role === "ADMIN") && (
              <h3 className="font-semibold text-text">{s.employeeName}</h3>
            )}

            <div className="text-sm text-text/70 mt-1">
              Month-Year: {s.monthYear}
            </div>

            <div className="text-sm mt-1">
              Amount: <span className="font-semibold">{s.amount}</span>
            </div>

            <div className="mt-2">
              <span
                className={`badge ${
                  s.paymentStatus === "PAID" ? "badge-success" : "badge-warning"
                }`}
              >
                {s.paymentStatus}
              </span>
            </div>
          </div>
        ))}
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

export default SalaryByEmployee;
