import React, { useContext, useEffect, useState } from "react";
// import { assets, manageJobsData } from "../assets/assets";
import moment from "moment";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../custom/custom.css";
const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const { backendUrl, companyToken } = useContext(AppContext);
  // function to fetch jobs list

  //change visibility
  const changeJobVisibility = async (id, currentVisibility) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      console.log(data);
      if (data.success) {
        const newVisibility = !currentVisibility;
        const message = newVisibility
          ? "This job listing is now open to all applicants."
          : "The visibility of the job has been restricted to you only.";

        newVisibility ? toast.success(message) : toast.error(message);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === id ? { ...job, visible: !job.visible } : job
          )
        );
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
      if (data.success) {
        setJobs(data.jobsData);
        console.log(data.jobsData);
      }
    } catch (error) {
      console.log("Error fetching jobs:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

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
            {jobs.map((job, index) => (
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
                    onChange={() => changeJobVisibility(job._id, job.visible)}
                    type="checkbox"
                    className="active:scale-120 w-4 h-4"
                    checked={job.visible}
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
