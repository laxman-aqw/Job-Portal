import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import { AppContext } from "../../context/appContext";

const barColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const AdminTopRecruiters = () => {
  const [topCompanies, setTopCompanies] = useState([]);
  const { backendUrl, adminToken } = useContext(AppContext);

  const fetchTotalJobPosts = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/top-companies",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (data.success) {
        setTopCompanies(data.data);
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

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
        🏆 Top Job Posting Companies
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topCompanies}
            layout="vertical"
            margin={{ top: 20, right: 20, left: -20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "Jobs Posted",
                position: "insideBottomRight",
                offset: -5,
                fill: "#6b7280",
                fontSize: 12,
              }}
            />
            <YAxis
              dataKey="companyName"
              type="category"
              tick={{ fill: "#6b7280", fontSize: 13 }}
              width={130}
            />
            <Tooltip
              wrapperStyle={{ fontSize: 13 }}
              contentStyle={{ borderRadius: "8px" }}
            />
            <Bar dataKey="totalJobs" radius={[6, 6, 6, 6]}>
              {topCompanies.map((_, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminTopRecruiters;
