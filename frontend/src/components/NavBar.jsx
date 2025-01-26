import React from "react";
// import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  return (
    <>
      <div className="shadow-md py-4 mx-2 rounded-2xl">
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
          <Link className="logo cursor-pointer" to="/">
            <span className="text-2xl font-medium">Rojgar</span>
            <span className="text-2xl font-medium text-blue-600">Chowk</span>
          </Link>
          {user ? (
            <div className="flex item-center gap-3">
              <Link
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:bg-blue-400"
                to="/applications"
              >
                Applied Jobs
              </Link>
              <p></p>
              <p className=" py-2">Hi,{user.firstName}</p>
              <UserButton />
            </div>
          ) : (
            <div className="flex gap-4 max-sm:text-xs">
              <button className="text-gray-600">Recruiter Login</button>
              <button
                onClick={(e) => openSignIn()}
                className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
