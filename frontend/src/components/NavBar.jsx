import React, { useContext } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <nav className="shadow-md py-4 mx-2 rounded-xl bg-white">
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
              className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
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
            <button
              onClick={(e) => setShowRecruiterLogin(true)}
              className="   cursor-pointer border-2  px-5 py-2 rounded-full border-sky-500 text-sky-700 hover:text-white hover:bg-gradient-to-r from-sky-500 to-sky-700 transition duration-300"
            >
              Recruiter Login
            </button>
            <button
              onClick={openSignIn}
              className=" text-white px-5 py-2 rounded-full  bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
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
