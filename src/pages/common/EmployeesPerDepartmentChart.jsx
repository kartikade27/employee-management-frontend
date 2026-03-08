import React, { useEffect, useState } from "react";
import { getAllDepartments } from "../../service/DepartmentService";
import { findByDepartmentsByEmployee } from "../../service/EmployeeService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function EmployeesPerDepartmentChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = (await getAllDepartments()).data;
        const results = await Promise.all(
          depts.map(async (d) => {
            const res = await findByDepartmentsByEmployee(d.departmentId);
            return {
              name: d.departmentName || d.name,
              employees: res.data.length,
            };
          })
        );
        setData(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="card bg-card border border-gray-200 shadow-lg rounded-xl p-4">
      <h2 className="text-lg font-bold mb-4 text-text">
        Employees Per Department
      </h2>
      {loading ? (
        <div className="skeleton h-96 w-full rounded-md"></div> // thoda bada skeleton
      ) : (
        <div className="h-96"> {/* height increased from 72 to 96 */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.1)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-text)", fontSize: 13 }}
              />
              <YAxis
                tick={{ fill: "var(--color-text)", fontSize: 13 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "rgba(0,0,0,0.1)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-text)", fontWeight: 600 }}
                itemStyle={{ color: "var(--color-primary-dark)", fontWeight: 500 }}
              />
              <Bar
                dataKey="employees"
                fill="var(--color-primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}