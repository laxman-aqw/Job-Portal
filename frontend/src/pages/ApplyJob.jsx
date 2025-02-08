import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/appContext";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { PiSuitcaseSimple } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";
import kconverter from "k-converter";
import moment from "moment";
import JobCard from "../components/JobCard";

import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const {
    jobs,
    backendUrl,
    user,
    userApplications,
    fetchUserApplications,
    userToken,
  } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/job/${id}`);
      if (data.success) {
        console.log(data);
        setJobData(data.job);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const applyHandlers = async () => {
    try {
      if (!user) {
        return toast.error("Login required");
      }
      if (!user.resume) {
        navigate("/applications");
        return toast.error("Upload your resume before applying");
      }
      NProgress.start();
      const { data } = await axios.post(
        backendUrl + "/api/users/apply-job",
        { jobId: jobData._id },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        fetchUserApplications();
        toast.success("Application submitted successfully");
      }
    } catch (error) {
      if (error.response) {
        // Show the server's error message if available
        toast.error(
          error.response.data.message || "An error occurred while applying."
        );
      } else {
        // Handle network errors or unexpected issues
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      NProgress.done();
    }
  };

  const checkedAlreadyApplied = () => {
    if (!user) {
      setIsAlreadyApplied(false); // Reset when the user logs out
      return;
    }
    const hasApplied = userApplications.some(
      (item) => item?.jobId?._id === jobData?._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  const filteredJobs = jobs
    .filter(
      (job) =>
        job?._id !== jobData?._id &&
        job?.companyId._id === jobData?.companyId._id
    )
    .filter((job) => {
      if (!userApplications) return true;
      const appliedJobIds = new Set(
        userApplications.map((app) => app.jobId._id)
      );
      return !appliedJobIds.has(job._id);
    })
    .slice(0, 4);

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkedAlreadyApplied();
    }
  }, [jobData, userApplications, id]);

  useEffect(() => {
    fetchJob();
  }, [id]);

  return jobData ? (
    <div>
      <NavBar />
      {jobData.visible ? (
        <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
          <div className="bg-white text-black rounded-xl shadow-lg w-full">
            <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-16 bg-sky-50 border border-sky-400 rounded-xl">
              {/* Company Details */}
              <div className="flex flex-col md:flex-row items-center">
                <img
                  className="h-24 w-24 bg-white rounded-lg p-4 mr-4 border border-gray-300 shadow-md"
                  src={jobData.companyId.image}
                  alt="Company Logo"
                />
                <div className="text-center md:text-left text-neutral-700">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    {jobData.title}
                  </h1>
                  <div className="flex flex-col md:flex-row gap-y-2 items-center justify-center md:justify-start space-x-6 mt-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <PiSuitcaseSimple className="text-2xl text-gray-600" />
                      <span className="font-medium">
                        {jobData.companyId.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CiLocationOn className="text-2xl text-gray-600" />
                      <span className="font-medium">{jobData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsPerson className="text-2xl text-gray-600" />
                      <span className="font-medium">{jobData.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BiDollar className="text-2xl text-gray-600" />
                      <span className="font-medium">
                        Salary: {kconverter.convertTo(jobData.salary)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply and Date */}
              <div className=" md:mt-0 text-left ">
                <button
                  onClick={applyHandlers}
                  className={`px-6 py-3  text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 ${
                    isAlreadyApplied
                      ? "opacity-50 cursor-not-allowed "
                      : "cursor-pointer hover:-translate-y-1"
                  }`}
                >
                  {isAlreadyApplied ? "Applied" : "Apply Now"}
                </button>
                {/* posted date */}
                <p className="mt-4 font-medium text-gray-500 text-sm">
                  Posted {moment(jobData.date).fromNow()}
                </p>
                {/* deadline date */}
                <p className="mt-2 font-medium text-left text-sm text-red-600">
                  Deadline:{" "}
                  {moment(jobData.deadline).isBefore(moment()) ? (
                    <span>Expired</span>
                  ) : (
                    moment(jobData.deadline).fromNow()
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Description grid */}
          <div className="flex flex-col lg:flex-row gap-8 px-2 py-4 rounded-xl">
            {/* Job Description Section */}
            <div className="flex-grow w-full lg:w-2/3 job-description-container shadow-lg p-5 lg:p-16 rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-800">
                <strong>Job Description</strong>
              </h2>
              <div className="prose max-w-none">
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: jobData.description }}
                />
              </div>
              <button
                onClick={applyHandlers}
                style={{ textTransform: "none" }}
                className={`mt-10 px-6 py-3  text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 text-transform-none ${
                  isAlreadyApplied
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
            {/* Right section more jobs */}
            <div className="lg:w-1/3">
              <h2 className="font-semibold text-2xl m-2">
                More jobs from {jobData.companyId.name}
              </h2>

              <div>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <div className="my-5" key={index}>
                      <JobCard job={job} />
                    </div>
                  ))
                ) : (
                  <div className="my-5">
                    No more new jobs from {jobData.companyId.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <div className="max-w-lg text-center p-8 bg-white shadow-xl rounded-lg border border-gray-200">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
              Oops! Job Unavailable
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              The job you're looking for has been removed by the company or is
              no longer available right now.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 text-lg bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  ) : (
    <div>
      <NavBar />
      <Loading />
    </div>
  );
};

export default ApplyJob;
