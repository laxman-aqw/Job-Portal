import { FaDotCircle } from "react-icons/fa";
import React from "react";
import { assets } from "../assets/assets";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-105 transition">
      {/* Company Logo */}
      <div className="mb-4">
        <img
          src={assets.company_icon}
          alt="Company Logo"
          className="w-16 h-16 object-contain mx-auto"
        />
      </div>

      {/* Job Title */}
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h4>

      <div className="flex items-center  text-gray-500 mb-4">
        <span className="flex items-center px-2 py-1.5 text-sm rounded mr-6 bg-blue-50 border border-blue-200 ">
          <FaDotCircle className="m-1" />
          {job.level}
        </span>

        {/* Job Location with Icon */}
        <span className="flex text-sm items-center px-2 py-1.5 rounded text-gray-600 bg-green-50 border border-green-200  ">
          <CiLocationOn className="text-xl" />
          {job.location}
        </span>
      </div>

      <p
        className="text-gray-700 mb-4"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      ></p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="bg-sky-700 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-all duration-300 cursor-pointer"
        >
          Apply Now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="border border-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
