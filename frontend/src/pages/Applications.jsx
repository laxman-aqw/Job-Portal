import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  return (
    <>
      <NavBar></NavBar>
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 sky-700 mb-6">
          Your Resume
        </h2>

        {/* Resume Section */}
        <div className="flex gap-4 mb-6 mt-3">
          {isEdit ? (
            <>
              <div className="max-w-md mx-auto my-8 p-8 text-center">
                {/* Upload Card */}
                <label
                  htmlFor="resumeUpload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-10 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 group"
                >
                  <input
                    id="resumeUpload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="hidden"
                  />
                  {/* Upload Icon */}
                  <img
                    src={assets.profile_upload_icon}
                    alt="Upload"
                    className="w-20 h-20 mb-4 object-contain group-hover:scale-105 transition-transform"
                  />
                  {/* Text Content */}
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-800">
                      Select Resume
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF format only (max. 5MB)
                    </p>
                  </div>
                </label>

                {/* Save Button */}
                <button
                  onClick={(e) => setIsEdit(false)}
                  type="button"
                  className="mt-6 w-full bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Resume Link */}
              <a
                href="#"
                className="px-6 py-2 bg-sky-200 border border-sky-300 text-sky-700 font-semibold rounded-lg shadow-md hover:bg-sky-100 transition-all flex gap-2 items-center justify-center"
              >
                {" "}
                <span>
                  <IoDocumentTextOutline />{" "}
                </span>
                View Resume
              </a>

              {/* Edit Button */}
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 bg-gray-200 text-sky-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-all flex  justify-center items-center gap-2"
              >
                <CiEdit />
                Edit
              </button>
            </div>
          )}
        </div>

        <div className=" w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Jobs Applied
          </h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobsApplied.map((job, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                        <span className="font-medium text-gray-900">
                          {job.company}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {job.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full  text-xs font-medium 
                ${
                  job.status === "Accepted"
                    ? "bg-green-100 text-green-800"
                    : job.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Applications;
