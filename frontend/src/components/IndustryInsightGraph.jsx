import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IndustryInsightGraph = ({ salaryRanges }) => {
  const chartData = salaryRanges.map((item) => ({
    role: item.role,
    Min: item.min,
    Median: item.median,
    Max: item.max,
  }));

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-bold mb-4 text-center">
        Salary Ranges by Role (Nepal)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="role"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-10}
            textAnchor="end"
          />
          <YAxis tickFormatter={(value) => `Rs ${value / 1000}k`} />
          <Tooltip formatter={(value) => `Rs ${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="Min" fill="#8884d8" />
          <Bar dataKey="Median" fill="#82ca9d" />
          <Bar dataKey="Max" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IndustryInsightGraph;
