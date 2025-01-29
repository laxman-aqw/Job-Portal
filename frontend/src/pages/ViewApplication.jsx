import React from "react";
import { viewApplicationsPageData } from "../assets/assets";
import { FaFileDownload } from "react-icons/fa";

const ViewApplication = () => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Applications
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-center text-gray-700 font-semibold">
                #
              </th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                User Name
              </th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                Job Title
              </th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                Location
              </th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                Resume
              </th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className="border-b text-left hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-gray-700 flex items-center space-x-2">
                  <img
                    src={applicant.imgSrc}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{applicant.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {applicant.jobTitle}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {applicant.location}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800"
                  >
                    <FaFileDownload className="inline mr-1" />
                    Resume
                  </a>
                </td>
                <td className="px-6 py-4 border-b ">
                  <div className="relative iinline-block text-left group">
                    <button className="text-gray-500 action-button">...</button>
                    <div className="z-7 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                      <button className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100">
                        Accept
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplication;
