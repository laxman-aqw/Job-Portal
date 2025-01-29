import React from "react";
import { assets, manageJobsData } from "../assets/assets";
import moment from "moment";

import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Jobs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2 font-medium text-gray-700">#</th>
              <th className="px-4 py-2 font-medium text-gray-700">Job Title</th>
              <th className="px-4 py-2 font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 font-medium text-gray-700">Location</th>
              <th className="px-4 py-2 font-medium text-gray-700">
                Applications
              </th>
              <th className="px-4 py-2 font-medium text-gray-700">
                Visibility
              </th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr key={index} className="border-t text-center hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                <td className="px-4 py-2 text-gray-600">{job.title}</td>
                <td className="px-4 py-2 text-gray-600">
                  {moment(job.date).format("ll")}
                </td>
                <td className="px-4 py-2 text-gray-600">{job.location}</td>
                <td className="px-4 py-2 text-gray-600">{job.applicants}</td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="active:scale-120 w-4 h-4  "
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex item-center justify-end">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="text-white px-5 cursor-pointer py-2 rounded-md hover:scale-105  bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
        >
          Add Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
