import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AppContext } from "../../context/appContext";
import { toast } from "react-toastify";

const AdminJobSeekers = () => {
  const [userStats, setUserStats] = useState([]);
  const { backendUrl, adminToken } = useContext(AppContext);
  console.log("the admin token is:", adminToken);
  const fetchJobSeekers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/job-seekers", {
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

        // Merge rawStats and accumulate total for each month
        let cumulativeTotal = 0;
        const mergedStats = last6Months.map((monthObj) => {
          const match = rawStats.find((stat) => stat.name === monthObj.name);
          if (match) {
            cumulativeTotal += match.total;
          }
          return {
            ...monthObj,
            total: cumulativeTotal,
          };
        });

        setUserStats(mergedStats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (adminToken) {
      fetchJobSeekers();
    }
  }, [adminToken]);

  return (
    <div>
      <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          👥 Job Seekers Growth Over Last 6 Months
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminJobSeekers;
