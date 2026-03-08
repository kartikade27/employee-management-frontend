import React from "react";
import CountUp from "react-countup";

export default function StatsCard({ title, value, icon, color, loading }) {
  return (
    <div className="card bg-card border border-gray-200 shadow-md rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
      {/* Icon */}
      <div className={`text-4xl ${color} transition-colors duration-300`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <p className="text-sm text-text/70">{title}</p>
        {loading ? (
          <div className="skeleton h-7 w-24 mt-1 rounded-md"></div>
        ) : (
          <h2 className="text-2xl font-bold text-text">
            <CountUp
              end={Number(value.toString().replace(/[^\d]/g, ""))}
              duration={1.4}
              separator=","
              prefix={
                typeof value === "string" && value.includes("₹") ? "₹ " : ""
              }
            />
          </h2>
        )}
      </div>
    </div>
  );
}
