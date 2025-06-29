import axios from "axios";
import React from "react";
import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../../context/appContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useState } from "react";
const AdminTotalJobPosts = () => {
  const [jobStats, setJobStats] = useState([]);
  const { backendUrl, adminToken } = useContext(AppContext);
  const fetchTotalJobPosts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/monthly-jobs", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      // console.log(data.data);
      if (data.success) {
        const rawStats = data.data;

        const now = new Date();
        const last6Months = Array.from({ length: 6 }).map((_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - 5 + i);
          return {
            name: date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            }),
            total: 0,
          };
        });

        // Merge actual data into last6Months
        const mergedStats = last6Months.map((monthObj) => {
          const match = rawStats.find((stat) => stat.name === monthObj.name);
          return match ? { ...monthObj, total: match.total } : monthObj;
        });

        setJobStats(mergedStats);
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
    <div>
      <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          💼 Monthly Jobs Posted Over Last 6 Months
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminTotalJobPosts;
