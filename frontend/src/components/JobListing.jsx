import React, { useContext, useState } from "react";
import { AppContext } from "../context/appContext";
import { CiSquareRemove } from "react-icons/ci";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* Search filter from hero component */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="mb-4 text-gray-600 ">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <CiSquareRemove
                      className="text-2xl"
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className=" ml-2 inline-flex items-center gap-2.5 bg-green-50 border border-green-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <CiSquareRemove
                      className="text-2xl"
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={(e) => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* category filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input className="scale-125" type="checkbox" />
                {category}
              </li>
            ))}
          </ul>
        </div>
        {/* location filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 mt-8">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input className="scale-125" type="checkbox" />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job listing */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Get your desired job from </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, index) => (
              <JobCard key={index} job={job}></JobCard>
            ))}
        </div>

        {/* pagination */}
        {jobs.length > 0 && (
          // <div>
          //   <a href="#job-list">
          //     <FaAngleLeft />
          //   </a>
          //   {Array.from({ length: Math.ceil(jobs.length / 6) }).map(
          //     (_, index) => (
          //       // eslint-disable-next-line react/jsx-key
          //       <a href="#job-list">
          //         <button>{index + 1}</button>
          //       </a>
          //     )
          //   )}
          //   <a href="#job-list">
          //     <FaAngleRight />
          //   </a>
          // </div>
          <div className="flex items-center justify-center space-x-2 mt-6">
            {/* Previous Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              <FaAngleLeft />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.ceil(jobs.length / 6) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition ${
                    currentPage === index + 1
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(jobs.length / 6) ? prev + 1 : prev
                )
              }
              className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              <FaAngleRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
