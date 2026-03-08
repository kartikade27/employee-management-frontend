import React, { useEffect, useState } from "react";
import { getAllEmployees } from "../../service/EmployeeService";
import toast from "react-hot-toast";

const EmployeeSelector = ({ onSelect, selectedId = "" }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);

      try {
        const res = await getAllEmployees();

        const list = res.data || [];

        setEmployees(list);

        if (!selectedId && list.length > 0) {
          onSelect(list[0].employeeId);
        }
      } catch {
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [onSelect, selectedId]);

  if (loading)
    return (
      <div className="flex justify-center py-3">
        <span className="loading loading-spinner"></span>
      </div>
    );

  if (!employees.length)
    return (
      <p className="text-center text-base-content/60">No employees found</p>
    );

  return (
    <div className="form-control w-full md:w-72">
      <label className="label">
        <span className="label-text font-medium">Select Employee</span>
      </label>

      <select
        className="select select-bordered w-full"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {employees.map((emp) => (
          <option key={emp.employeeId} value={emp.employeeId}>
            {emp.firstName} {emp.lastName} ({emp.employeeId})
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmployeeSelector;
