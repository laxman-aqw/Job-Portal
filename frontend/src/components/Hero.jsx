import React, { useContext, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { AppContext } from "../context/appContext";
const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
    console.log({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
  };

  return (
    <>
      <div className="mx-10 md:mx-20 lg:mx-30 mt-10 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 py-12 ">
          <div className=" text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Find Your <span className="text-blue-600">Dream Job</span> Today
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Explore thousands of job listings from top companies worldwide.
              Take the next step in your career journey.
            </p>
            <div className="mt-6 flex flex-row justify-center ">
              <div className="relative flex items-center">
                <CiSearch className="absolute left-3 text-gray-400 text-xl" />
                <input
                  type="text"
                  className="w-full sm:w-auto px-10 py-3 rounded-l-lg border border-gray-300 focus:outline-none bg-white"
                  placeholder="Search for jobs "
                  ref={titleRef}
                />
              </div>
              <div className="relative flex items-center -ml-2">
                <CiLocationOn className="absolute left-3 text-gray-400 text-xl" />
                <input
                  type="text"
                  className="w-full sm:w-auto px-10 py-3 border border-gray-300 focus:outline-none bg-white"
                  placeholder="Enter location"
                  ref={locationRef}
                />
              </div>
              <button
                onClick={onSearch}
                className="w-10 md:w-auto hover:bg-blue-500 cursor-pointer px-2 py-3 md:px-6 bg-blue-600 text-white font-medium rounded-r-lg shadow border-none"
              >
                <CiSearch className="text-2xl font-bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10 rounded-2xl md:mx-32 border my-5 shadow-md border-gray-300 py-5">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Trusted by Leading Companies
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="w-36 h-20 flex items-center justify-center bg-white rounded-lg shadow-md">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Esewa_logo.webp/1100px-Esewa_logo.webp.png"
                alt="Company 1"
                className="h-auto max-h-full"
              />
            </div>

            {/* Company Logo 2 */}
            <div className="w-36 h-20 flex items-center justify-center bg-white rounded-lg shadow-md">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUj5QLHVwPKjiAh0x4-NfqsmpfaCNFYi6HIQ&s/100x50"
                alt="Company 2"
                className="h-auto max-h-full"
              />
            </div>

            <div className="w-36 h-20 flex items-center justify-center bg-white rounded-lg shadow-md">
              <img
                src="https://s3.amazonaws.com/resumator/customer_20191108174918_T3HDEM7NCAYEC2DB/logos/20191108184722_fusemachines_logo_jpg.jpg"
                alt="Company 3"
                className="h-auto max-h-full"
              />
            </div>

            <div className="w-36 h-20 flex items-center justify-center bg-white rounded-lg shadow-md">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Daraz_Logo.png"
                alt="Company 4"
                className="h-auto max-h-full"
              />
            </div>

            <div className="w-36 h-20 flex items-center justify-center bg-white rounded-lg shadow-md">
              <img
                src="https://media.licdn.com/dms/image/v2/C4E1BAQEsCT5sQW2grg/company-background_10000/company-background_10000/0/1584083622781/cotiviti_nepal__cover?e=2147483647&v=beta&t=MPhFvKGR3g14bICPWA3-o3XsCLlLRY5VKnOWHqqxFqA"
                alt="Company 5"
                className="h-auto max-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
