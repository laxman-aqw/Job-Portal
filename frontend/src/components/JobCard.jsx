import { FaDotCircle } from "react-icons/fa";
import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300">
      {/* Company Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={job.companyId.image}
          alt="Company Logo"
          className="w-20 h-20 rounded-full object-contain"
        />
      </div>

      {/* Job Title */}
      <h4 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        {job.title}
      </h4>

      {/* Job Level & Location */}
      <div className="flex justify-center gap-4 mb-4">
        <span className="flex items-center text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
          <FaDotCircle className="mr-2 text-blue-500" />
          {job.level}
        </span>
        <span className="flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
          <CiLocationOn className="mr-2 text-green-500 text-lg" />
          {job.location}
        </span>
      </div>

      {/* Job Description */}
      <p
        className="text-gray-600 text-center mb-6"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      ></p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="hover:-translate-y-1 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 text-white font-medium px-6 py-2 rounded-lg shadow-md cursor-pointer"
        >
          Apply Now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="hover:-translate-y-1 border border-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
