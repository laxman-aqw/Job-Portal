import React, { useState, useRef, useEffect, useContext } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { AppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const { user, setUser, setUserToken } = useContext(AppContext);
  const logoutHandler = () => {
    NProgress.start();
    setUserToken(null);
    localStorage.removeItem("userToken");
    setUser(null);
    navigate("/");
    console.log("log out");
    NProgress.done();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative inline-block text-left rounded-full hover:shadow-lg shadow-gray-400"
      ref={dropdownRef}
    >
      {/* Profile Picture */}
      <img
        src={user.image}
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-gray-500 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
          <div className="py-2">
            <a
              href="/profile"
              className="flex gap-2 items-center  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <IoPersonOutline className="text-xl " /> View Profile
            </a>
            <a
              href="/settings"
              className=" flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CiSettings className="text-xl" />
              Settings
            </a>
            <button
              onClick={logoutHandler}
              className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <CiLogout className="text-xl" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
