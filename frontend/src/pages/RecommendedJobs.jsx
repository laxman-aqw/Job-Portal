import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import { CiSquareRemove } from "react-icons/ci";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCard from "../components/JobCard";
import NavBar from "../components/NavBar";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";

const RecommendedJobs = () => {
  const { user, userToken, recommendedJobs, extractResumeText } =
    useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.resume) {
      extractResumeText(user.resume);
      console.log("the pdf url is: ", user.resume);
    }
  }, [user]);

  return (
    <div>
      <NavBar></NavBar>

      <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
        {!userToken ? (
          <div></div>
        ) : (
          <section className="w-full text-gray-800 max-lg:px-4 bg-gray-100 p-2 rounded-2xl ">
            <h3 className="font-medium text-3xl py-2 " id="job-list">
              Top Recommendations
            </h3>
            <p className="mb-4">Jobs recommended to you </p>
            <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendedJobs
                .slice((currentPage - 1) * 9, currentPage * 9)
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
        )}
      </div>
      <AppDownload></AppDownload>
      <Footer></Footer>
    </div>
  );
};

export default RecommendedJobs;
