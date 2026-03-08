import React, { useEffect, useState } from "react";
import StatsCard from "../common/StatsCard";
import EmployeesPerDepartmentChart from "../common/EmployeesPerDepartmentChart";
import LeaveStatusStats from "../common/LeaveStatusStats";

import {
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaMoneyBillWave,
} from "react-icons/fa";

import { getAllEmployees } from "../../service/EmployeeService";
import { getAllDepartments } from "../../service/DepartmentService";
import { getLeavesByStatus } from "../../service/leaveRequestService";
import { totalSalaryPaid } from "../../service/salaryPaymentService";

export default function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const emp = await getAllEmployees();
        const dept = await getAllDepartments();
        const l = await getLeavesByStatus("PENDING");
        const salary = await totalSalaryPaid();

        setEmployees(emp.data || []);
        setDepartments(dept.data || []);
        setLeaves(l.data || []);
        setTotalSalary(salary.data || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    {
      title: "Employees",
      value: employees.length,
      icon: <FaUsers />,
      color: "text-primary",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: <FaBuilding />,
      color: "text-success",
    },
    {
      title: "Pending Leaves",
      value: leaves.length,
      icon: <FaClipboardCheck />,
      color: "text-warning",
    },
    {
      title: "Total Salary",
      value: `₹ ${totalSalary}`,
      icon: <FaMoneyBillWave />,
      color: "text-error",
    },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="opacity-70 mt-1">
            Company performance overview
          </p>
        </div>

      

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} loading={loading} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeesPerDepartmentChart />
        <LeaveStatusStats />
      </div>

    </div>
  );
}