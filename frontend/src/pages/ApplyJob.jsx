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

const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const { jobs } = useContext(AppContext);

  const fetchJob = async () => {
    const data = jobs.filter((job) => job._id === id);
    if (data.length !== 0) {
      setJobData(data[0]);
      console.log(data[0]);
    }
  };

  useEffect(() => {
    if (jobs.length > 0) {
      fetchJob();
    }
  }, [id, jobs]);

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
                <div className="flex items-center justify-center md:justify-start space-x-6 mt-2 text-gray-600">
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
            <div className="mt-8 md:mt-0 text-center md:text-right">
              <button className="px-6 py-3 bg-sky-700 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-all">
                Apply Now
              </button>
              <p className="mt-4 font-medium text-gray-500 text-sm">
                Posted {moment(jobData.date).fromNow()}
              </p>
              <p className="mt-2 font-medium text-center text-sm text-red-600">
                Deadline: {moment(jobData.deadline).fromNow()}
              </p>
            </div>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="mt-12 w-full lg:w-2/3 job-description-container shadow-lg p-5 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-800">
            <strong>Job Description</strong>
          </h2>
          <div className="prose max-w-none">
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: jobData.description }}
            />
          </div>
          <button className="mt-10 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <NavBar />
      <Loading />
    </div>
  );
};

export default ApplyJob;
