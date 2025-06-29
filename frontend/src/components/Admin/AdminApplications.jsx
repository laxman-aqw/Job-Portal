import React, { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

// Pie chart colors: Pending (Yellow), Accepted (Green), Rejected (Red)
const pieColors = ["#facc15", "#10b981", "#ef4444"];

const AdminApplications = () => {
  const [applicationStatus, setApplicationStatus] = useState([]);
  const { backendUrl, adminToken } = useContext(AppContext);

  const fetchTotalJobPosts = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/applications-count`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        const status = data.data;
        const formatted = [
          { name: "Pending", value: status.pending || 0 },
          { name: "Accepted", value: status.accepted || 0 },
          { name: "Rejected", value: status.rejected || 0 },
        ];
        setApplicationStatus(formatted);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchTotalJobPosts();
    }
  }, [adminToken]);

  // Custom label showing percentage
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
        📊 Application Status Overview
      </h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={applicationStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={renderCustomLabel}
            >
              {applicationStatus.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[index % pieColors.length]}
                  cornerRadius={5}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                fontSize: "14px",
              }}
            />
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "13px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminApplications;
