import React, { useContext, useState } from "react";
// import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";

import axios from "axios";
import ProfileDropdown from "./ProfileDropDown";

const NavBar = () => {
  const { setShowRecruiterLogin, setShowUserLogin, user } =
    useContext(AppContext);

  return (
    <nav className="shadow-md py-4 mx-2 mb-2 rounded-xl bg-white sticky z-10 top-0">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link className="flex items-center cursor-pointer" to="/">
          <span className="text-2xl font-bold text-gray-800">Rojgar</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
            Chowk
          </span>
        </Link>

        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/applications"
              className="px-4 py-2 hover:-translate-y-1 text-white rounded-lg bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
            >
              Applied Jobs
            </Link>
            <p className="hidden md:block text-gray-600">
              Hi, <span className="font-medium">{user.firstName}</span>
            </p>

            <ProfileDropdown
              user={user}
              className="hover:shadow-2xl"
            ></ProfileDropdown>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="font-semibold  hover:-translate-y-1 cursor-pointer border-2  px-5 py-2 rounded-lg border-sky-500 text-sky-700 hover:text-white hover:bg-gradient-to-r from-sky-500 to-sky-700 transition duration-300"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className=" text-white font-semibold px-5 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95  hover:-translate-y-1 transition duration-300"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
