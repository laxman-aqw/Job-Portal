import React from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <nav className="shadow-md py-4 mx-2 rounded-xl bg-white">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link className="flex items-center cursor-pointer" to="/">
          <span className="text-2xl font-bold text-gray-800">Rojgar</span>
          <span className="text-2xl font-bold text-sky-700">Chowk</span>
        </Link>

        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/applications"
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500 text-white rounded-full active:bg-sky-800 transition duration-300"
            >
              Applied Jobs
            </Link>
            <p className="hidden md:block text-gray-600">
              Hi, <span className="font-medium">{user.firstName}</span>
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition duration-300">
              Recruiter Login
            </button>
            <button
              onClick={openSignIn}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-500 active:bg-blue-700 transition duration-300"
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
