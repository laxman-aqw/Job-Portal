import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import { CiSquareRemove } from "react-icons/ci";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
const JobListing = () => {
  const {
    user,
    isSearched,
    searchFilter,
    setSearchFilter,
    jobs,
    recommendedJobs,
    extractResumeText,
  } = useContext(AppContext);
  // console.log("the user for job listing", user?.resume);
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [selectedLocations, setSelectedLocations] = useState([]);

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    if (user?.resume) {
      extractResumeText(user.resume);
      console.log("the pdf url is: ", user.resume);
    }
  }, [user]);

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      <div className="w-full lg:w-1/4 bg-white px-6 py-4 mr-2 shadow-lg rounded-md">
        {/* Search filter from hero component*/}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-semibold text-xl mb-4 text-gray-800">
                Current Search
              </h3>
              <div className="mb-4 text-gray-700 space-y-2">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2 mx-2 bg-blue-100 border border-blue-300 px-4 py-2 rounded-full text-bsky-700">
                    {searchFilter.title}
                    <CiSquareRemove
                      className="text-2xl cursor-pointer  hover:scale-110"
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="inline-flex items-center gap-2 bg-green-100 border border-green-300 px-4 py-2 rounded-full text-green-700">
                    {searchFilter.location}
                    <CiSquareRemove
                      className="text-2xl cursor-pointer hover:scale-110 transition"
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                    />
                  </span>
                )}
              </div>
            </>
          )}

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="cursor-pointer w-full  px-6 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-100 transition"
        >
          {showFilter ? "Close Filters" : "Open Filters"}
        </button>

        {/* Category filter */}
        <div
          className={`bg-white p-6 shadow-lg rounded-md ${
            showFilter ? "" : "hidden"
          }`}
        >
          <h4 className="font-semibold text-lg py-2 text-gray-800 border-b border-gray-200">
            Search by Categories
          </h4>
          <ul className="pt-1">
            {JobCategories.map((category, index) => (
              <li
                className="group hover:scale-105 transition-transform"
                key={index}
              >
                <label
                  htmlFor={`category-${index}`}
                  className={`flex items-center gap-3 py-1 px-2 rounded cursor-pointer w-full transition-all
             hover:scale-[1.02] active:scale-100
             ${
               selectedCategories.includes(category)
                 ? "bg-sky-50 border border-sky-200" // Selected state
                 : "hover:bg-gray-50" // Default hover state
             }`}
                >
                  <input
                    id={`category-${index}`}
                    className="scale-125 accent-sky-700 cursor-pointer"
                    type="checkbox"
                    onChange={() => handleCategoryChange(category)}
                    checked={selectedCategories.includes(category)}
                  />
                  <span className="text-gray-700 text-sm group-hover:text-sky-700 transition-colors">
                    {category}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {/* Location Filter */}
          <h4 className="font-semibold text-lg py-2 mt-4 text-gray-800 border-b border-gray-200">
            Search by Location
          </h4>
          <ul className="pt-1">
            {JobLocations.map((location, index) => (
              <li className="group transition-colors" key={index}>
                <label
                  htmlFor={`location-${index}`}
                  className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer w-full
             transition-all hover:scale-[1.02] active:scale-100
             ${
               selectedLocations.includes(location)
                 ? "bg-green-50 border border-green-200"
                 : "hover:bg-gray-50"
             }`}
                >
                  <input
                    id={`location-${index}`}
                    className="scale-125 accent-green-600 cursor-pointer"
                    type="checkbox"
                    onChange={() => handleLocationChange(location)}
                    checked={selectedLocations.includes(location)}
                  />
                  <span className="text-gray-700 text-sm group-hover:text-green-700 flex-1">
                    {location}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full lg:w-3/4">
        <section className="w-full text-gray-800 max-lg:px-4 bg-gray-100 p-2 rounded-2xl ">
          <h3 className="font-medium text-3xl py-2 " id="job-list">
            Top Recommendations
          </h3>
          <p className="mb-4">Jobs recommended to you </p>
          <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendedJobs
              .slice((currentPage - 1) * 3, currentPage * 3)
              .map((job, index) => (
                <JobCard key={index} job={job}></JobCard>
              ))}
          </div>
          <div className="flex justify-center mt-4">
            <button className="border-b-2 font-medium cursor-pointer px-4 my-2 hover:scale-105 transition">
              View More Recommended Jobs For You →
            </button>
          </div>
        </section>

        {/* overall job listing */}
        <section className="w-full text-gray-800 max-lg:px-4 py-4">
          <h3 className="font-medium text-3xl py-2" id="job-list">
            Latest Jobs
          </h3>
          <p className="mb-8">Get your desired job from </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredJobs
              .slice((currentPage - 1) * 6, currentPage * 6)
              .map((job, index) => (
                <JobCard key={index} job={job}></JobCard>
              ))}
          </div>

          {/* pagination */}
          {filteredJobs.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              {/* Previous Button */}
              <button
                onClick={() => {
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
                  window.scrollTo(0, 0);
                }}
                className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full hover:bg-sky-700 hover:text-white transition cursor-pointer"
              >
                <FaAngleLeft />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo(0, 0);
                    }}
                    className={`flex cursor-pointer hover:scale-120 items-center justify-center w-8 h-8 rounded-full transition  ${
                      currentPage === index + 1
                        ? "bg-blue-100 text-sky-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => {
                  setCurrentPage((prev) =>
                    prev < Math.ceil(filteredJobs.length / 12) ? prev + 1 : prev
                  );
                  window.scrollTo(0, 0);
                }}
                className="flex cursor-pointer items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full hover:bg-sky-700 hover:text-white transition"
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </section>
      </div>
      {/* recommended Job listing */}
    </div>
  );
};

export default JobListing;
