import React, { useEffect, useState } from "react";
import { getLeavesByStatus } from "../../service/leaveRequestService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function LeaveStatusStats() {
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = await getLeavesByStatus("APPROVED");
        const r = await getLeavesByStatus("REJECTED");
        setApproved(a.data.length);
        setRejected(r.data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = [
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["var(--color-primary)", "var(--color-accent)"];

  return (
    <div className="card bg-card border border-gray-200 shadow-lg rounded-xl p-4">
      <h2 className="text-lg font-bold mb-2 text-text">
        Leave Status Overview
      </h2>

      {loading ? (
        <div className="skeleton h-72 w-full rounded-md"></div>
      ) : (
        <>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "var(--color-text)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <div className="badge text-base-100 bg-primary">
              Approved: {approved}
            </div>
            <div className="badge text-base-100 bg-accent">
              Rejected: {rejected}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
