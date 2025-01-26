import React, { useContext, useEffect, useState } from "react";
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
                  <span className="inline-flex items-center gap-2 mx-2 bg-blue-100 border border-blue-300 px-4 py-2 rounded-full text-blue-700">
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
          className="w-full lg:hidden px-6 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-100 transition"
        >
          {showFilter ? "Close Filters" : "Open Filters"}
        </button>

        {/* Category filter */}
        <div
          className={`bg-white p-6 shadow-lg rounded-md ${
            showFilter ? "" : "max-lg:hidden"
          }`}
        >
          <h4 className="font-semibold text-lg py-4 text-gray-800 border-b border-gray-200">
            Search by Categories
          </h4>
          <ul className="space-y-4 pt-4">
            {JobCategories.map((category, index) => (
              <li
                className="flex hover:scale-105 items-center gap-3 p-2 rounded transition hover:bg-gray-50 cursor-pointer"
                key={index}
              >
                <input
                  className="scale-125 accent-blue-600 cursor-pointer"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                <label
                  htmlFor={`category-${index}`}
                  className="text-gray-700 cursor-pointer"
                >
                  {category}
                </label>
              </li>
            ))}
          </ul>

          {/* Location Filter */}
          <h4 className="font-semibold text-lg py-4 mt-8 text-gray-800 border-b border-gray-200">
            Search by Location
          </h4>
          <ul className="space-y-4 pt-4">
            {JobLocations.map((location, index) => (
              <li
                className="flex hover:scale-105 items-center gap-3 p-2 rounded transition hover:bg-gray-50 cursor-pointer"
                key={index}
              >
                <input
                  className="scale-125 accent-green-600 cursor-pointer"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />
                <label
                  htmlFor={`location-${index}`}
                  className="text-gray-700 cursor-pointer"
                >
                  {location}
                </label>
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
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              <FaAngleLeft />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`flex hover:scale-120 items-center justify-center w-8 h-8 rounded-full transition ${
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
                  prev < Math.ceil(filteredJobs.length / 6) ? prev + 1 : prev
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
