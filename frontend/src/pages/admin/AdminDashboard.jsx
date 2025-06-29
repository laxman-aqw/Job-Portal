import React from "react";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AdminJobSeekers from "../../components/Admin/AdminJobSeekeers";
import AdminTotalJobPosts from "../../components/Admin/AdminTotalJobPosts";
import AdminRecruiters from "../../components/Admin/AdminRecruiters";
import AdminApplications from "../../components/Admin/AdminApplications";
import AdminTopRecruiters from "../../components/Admin/AdminTopRecruiters";

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🛠️ Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AdminJobSeekers />
        <AdminTotalJobPosts />
        <AdminRecruiters />
        <AdminApplications />
        <AdminTopRecruiters />
      </div>

      {/* <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📋 Recent Activity
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✅ Verified company: Tech Solutions Pvt. Ltd.</li>
          <li>📝 New job posted: "Frontend Developer" by CodeCraft Inc.</li>
          <li>🚫 User suspended: johndoe99</li>
          <li>📥 Application received: UX Designer role at DesignHub</li>
          <li>⭐ Recruiter upgraded to premium: HR Nepal</li>
        </ul>
      </div> */}
    </div>
  );
};

export default AdminDashboard;
