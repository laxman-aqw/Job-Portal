import React, { useContext, useEffect, useState } from "react";
import { viewApplicationsPageData } from "../assets/assets";
import { FaFileDownload } from "react-icons/fa";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import { MdOutlineDone } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
const ViewApplication = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  // console.log("The token is", companyToken);

  const [applicants, setApplicants] = useState(false);
  //function to fetch company job applicants
  const fetchCompanyJobApplicants = async () => {
    try {
      // console.log(companyToken);
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
      if (data.success) {
        const reversedApplicants = data.applications.reverse();

        setApplicants(reversedApplicants);
        console.log("Console log applicant state", applicants);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            `Server Error: ${error.response.status}`
        );
      } else if (error.request) {
        toast.error("Network error: No response from the server.");
      } else {
        toast.error("Error: " + error.message);
      }
    }
  };

  //update application status
  const updateApplicationStatus = async (id, status) => {
    try {
      NProgress.start();
      const { data } = await axios.put(
        backendUrl + "/api/company/change-status",
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      if (data.success) {
        toast.success("Application status updated successfully.");
        fetchCompanyJobApplicants();
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            `Server Error: ${error.response.status}`
        );
      } else if (error.request) {
        toast.error("Network error: No response from the server.");
      } else {
        toast.error("Error: " + error.message);
      }
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplicants();
    }
  }, [companyToken]);

  useEffect(() => {
    console.log("Applicants state has changed:", applicants);
  }, [applicants]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Applications
      </h2>
      {applicants ? (
        <div className="overflow-x-auto">
          <table className="min-w-full mb-10 bg-white border border-gray-300 rounded-lg shadow-md">
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
              {applicants.map((applicant, index) => (
                <tr key={index} className={`border-b  text-left `}>
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-700 flex items-center space-x-2">
                    <img
                      src={applicant.userId.image}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>
                      {applicant.userId.firstName +
                        " " +
                        applicant.userId.lastName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {applicant.jobId.title}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {applicant.jobId.location}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 cursor-pointer hover:text-sky-800"
                    >
                      <FaFileDownload className="inline mr-1" />
                      Resume
                    </a>
                  </td>
                  <td className="px-6 py-4 border-b ">
                    {applicant.status === "Pending" ? (
                      <div className="relative inline-block text-left group">
                        <button className="text-gray-500 action-button text-2xl">
                          ...
                        </button>
                        <div className="z-7 hidden absolute top-0 left-0 md:left-0  mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block ">
                          <button
                            onClick={() =>
                              updateApplicationStatus(applicant._id, "Accepted")
                            }
                            className="block cursor-pointer w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateApplicationStatus(applicant._id, "Rejected")
                            }
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex justify-center items-center px-2  rounded-full  text-2xl font-bold 
                `}
                      >
                        {applicant.status === "Accepted" && (
                          <MdOutlineDone className=" text-green-800" />
                        )}
                        {applicant.status === "Rejected" && (
                          <AiOutlineClose className="text-red-800" />
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading> </Loading>
      )}
    </div>
  );
};

export default ViewApplication;
