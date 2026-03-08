import React, { useState, useEffect } from "react";
import { generateSalary } from "../../service/salaryPaymentService";
import { getAllEmployees } from "../../service/EmployeeService";
import toast from "react-hot-toast";

const GenerateSalary = ({ onSuccess, refreshTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployees();
        setEmployees(res.data);
        if (res.data.length > 0) setEmployeeId(res.data[0].employeeId);
      } catch {
        toast.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, [refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !monthYear || !amount)
      return toast.error("All fields are required");
    if (Number(amount) <= 0) return toast.error("Amount must be > 0");

    setLoading(true);
    try {
      await generateSalary({
        employeeId,
        monthYear,
        amount: Number(amount),
        status,
      });
      toast.success("Salary generated successfully!");
      setMonthYear("");
      setAmount("");
      setStatus("PENDING");
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Employee Select */}
      <div className="form-control w-full">
        <label className="label">Employee</label>
        <select
          className="select select-bordered w-full"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.firstName} {emp.lastName} ({emp.employeeId})
            </option>
          ))}
        </select>
      </div>

      {/* Month-Year */}
      <div className="form-control w-full">
        <label className="label">Month & Year</label>
        <input
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {/* Amount */}
      <div className="form-control w-full">
        <label className="label">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="input input-bordered w-full"
        />
      </div>

      {/* Status */}
      <div className="form-control w-full">
        <label className="label">Status</label>
        <select
          className="select select-bordered w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
        </select>
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Salary"}
      </button>
    </form>
  );
};

export default GenerateSalary;
