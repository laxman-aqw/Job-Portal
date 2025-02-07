import React, { useContext, useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaBars } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { SiNginxproxymanager } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { AppContext } from "../context/appContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { company, setCompany, setCompanyToken } = useContext(AppContext);

  // function to logout for the company
  const logout = () => {
    NProgress.start();
    setCompanyToken(null);
    localStorage.removeItem("lastRoute");
    localStorage.removeItem("companyToken");
    setCompany(null);
    navigate("/");
    NProgress.done();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-center items-center relative z-40 sticky top-0">
        <Link
          className="flex items-center text-center cursor-pointer ml-4"
          to="/"
        >
          <span className="text-2xl font-bold">Rojgar</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
            Chowk
          </span>
        </Link>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`bg-white text-gray-700 p-5 flex flex-col transition-all duration-300 fixed h-full top-0 left-0 z-50 shadow-md 
          ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          {/* Sidebar Toggle Button (Inside Sidebar) */}
          <button
            className="text-2xl hover:scale-110 p-2 text-gray-700 self-start"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </button>

          {/* Profile Section */}
          {company && (
            <div className="flex flex-col items-center border-b border-gray-700 pb-4">
              <img
                src={company.image}
                alt="Company Icon"
                className="w-10 h-10 rounded-full border-2 border-gray-500"
              />
              {isSidebarOpen && (
                <p className="mt-2 font-semibold text-gray-700 text-center">
                  Welcome, {company.name}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="mt-5 flex flex-col space-y-3">
            {/* Add Job */}
            <NavLink to="/dashboard/add-job">
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-2 px-1 py-3 rounded cursor-pointer
                  ${
                    isActive
                      ? "bg-blue-200 text-black border-r-4 border-blue-400"
                      : "hover:bg-blue-100 text-black"
                  }
                  ${isSidebarOpen ? "justify-start" : "justify-center"}
                  `}
                >
                  <CgAddR className="text-2xl" />
                  {isSidebarOpen && <span>Add Jobs</span>}
                </div>
              )}
            </NavLink>

            {/* Manage Jobs */}
            <NavLink to="/dashboard/manage-jobs">
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-2 px-1 py-3 rounded cursor-pointer
                  ${
                    isActive
                      ? "bg-blue-200 text-black border-r-4 border-blue-400"
                      : "hover:bg-blue-100 text-black"
                  }
                  ${isSidebarOpen ? "justify-start" : "justify-center"}
                  `}
                >
                  <SiNginxproxymanager className="text-2xl" />
                  {isSidebarOpen && <span>Manage Jobs</span>}
                </div>
              )}
            </NavLink>

            {/* View Applications */}
            <NavLink to="/dashboard/view-applications">
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-2 px-1 py-3 rounded cursor-pointer
                  ${
                    isActive
                      ? "bg-blue-200 text-black border-r-4 border-blue-400"
                      : "hover:bg-blue-100 text-black"
                  }
                  ${isSidebarOpen ? "justify-start" : "justify-center"}
                  `}
                >
                  <FaPeopleGroup className="text-2xl" />
                  {isSidebarOpen && <span>View Applications</span>}
                </div>
              )}
            </NavLink>
          </nav>

          {/* Logout Button */}
          <button
            onClick={logout}
            className={`mt-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md text-center flex items-center justify-center cursor-pointer
            ${isSidebarOpen ? "w-full" : "w-12"}
            `}
          >
            {isSidebarOpen ? (
              <>
                <LuLogOut className="text-2xl" />
                <span> Logout</span>
              </>
            ) : (
              <LuLogOut className="text-2xl" />
            )}
          </button>
        </aside>

        {/* Main Content (Shifts when Sidebar is Open) */}
        <main
          className={`flex-1 bg-gray-100 p-6 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
