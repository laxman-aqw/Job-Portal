// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavBar from "../components/NavBar";

const NotFound = () => {
  return (
    <div>
      <NavBar />
      <div className="h-screen bg-gray-100 flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-[10rem] font-extrabold text-gray-800">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-2xl text-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
