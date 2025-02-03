import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/appContext";
import { useParams } from "react-router-dom";
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
const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const { jobs, backendUrl } = useContext(AppContext);

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

  useEffect(() => {
    fetchJob();
  }, []);

  return jobData ? (
    <div>
      <NavBar />
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
            <div className=" md:mt-0 text-center md:text-right">
              <button className="px-6 py-3  text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300">
                Apply Now
              </button>
              {/* posted date */}
              <p className="mt-4 font-medium text-gray-500 text-sm">
                Posted {moment(jobData.date).fromNow()}
              </p>
              {/* deadline date */}
              <p className="mt-2 font-medium text-center text-sm text-red-600">
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
            <button className="mt-10 px-6 py-3  text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300">
              Apply Now
            </button>
          </div>
          {/* Right section more jobs */}
          <div className="lg:w-1/3">
            <h2 className="font-semibold text-2xl m-2">
              More jobs from {jobData.companyId.name}
            </h2>

            {jobs
              .filter(
                (job) =>
                  job._id !== jobData._id &&
                  job.companyId._id === jobData.companyId._id
              )
              .filter((job) => true)
              .slice(0, 4)
              .map((job, index) => (
                <div className="my-5" key={index}>
                  <JobCard job={job} />
                </div>
              ))}
          </div>
        </div>
      </div>
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
