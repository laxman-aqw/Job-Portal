import React, { useContext, useState } from "react";
// import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";

import axios from "axios";
import ProfileDropdown from "./ProfileDropDown";

const NavBar = () => {
  const { setShowRecruiterLogin, setShowUserLogin, user } =
    useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/applications", label: "Applied Jobs" },
    { path: "/ai/career-guidance", label: "Career Guidance" },
    { path: "/", label: "Interview Prep" },
    { path: "/", label: "Industry Insights" },
    { path: "/", label: "Resume Builder" },
  ];

  return (
    <nav className="shadow-md py-4 mx-2 mb-2 rounded-xl bg-white sticky z-10 top-0">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          className="flex items-center cursor-pointer"
          to="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.location.reload();
            }
          }}
        >
          <span className="text-2xl font-bold text-gray-800">Rojgar</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
            Chowk
          </span>
        </Link>

        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-1 py-2 transition-colors duration-200 group ${
                    location.pathname === link.path
                      ? "text-sky-600 font-medium"
                      : "text-gray-700 hover:text-sky-600"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-sky-600 transition-all duration-300 ${
                      location.pathname === link.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <p className=" text-gray-600 text-sm">
                Hi,{" "}
                <span className="font-medium text-gray-800">
                  {user.firstName}
                </span>
              </p>

              <ProfileDropdown
                user={user}
                className="hover:shadow-md transition-shadow duration-200"
              />
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-sky-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="font-semibold hover:-translate-y-1 cursor-pointer border-2 px-4 py-1.5 md:px-5 md:py-2 rounded-lg border-sky-500 text-sky-700 hover:text-white hover:bg-gradient-to-r from-sky-500 to-sky-700 transition duration-300 text-sm md:text-base"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className="text-white font-semibold px-4 py-1.5 md:px-5 md:py-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500 active:scale-95 hover:-translate-y-1 transition duration-300 text-sm md:text-base"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="lg:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "bg-sky-50 text-sky-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
