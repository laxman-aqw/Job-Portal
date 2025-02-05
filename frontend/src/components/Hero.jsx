import React, { useContext, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
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
      {/* Hero Section */}
      <div className="mx-4 md:mx-8 lg:mx-16 mt-8 md:mt-12 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 shadow-lg">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover your next career move with 10000+ jobs opportunities from
              leading companies worldwide.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-sky-300 focus:outline-sky-300  focus:border-sky-300  focus:ring-2 focus:ring-sky-100 bg-white text-gray-700 placeholder-gray-400 transition-all"
                  placeholder="Job title or keywords"
                  ref={titleRef}
                />
              </div>

              <div className="relative flex-1">
                <IoLocation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-sky-300  focus:outline-sky-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 bg-white text-gray-700 placeholder-gray-400 transition-all"
                  placeholder="Location"
                  ref={locationRef}
                />
              </div>
              <button
                onClick={onSearch}
                className="sm:w-auto px-8 py-4 hover:-translate-y-1 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl  flex items-center gap-2 justify-center cursor-pointer"
              >
                <FaSearch className="text-lg" />
                <span>Search Jobs</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Companies Section */}
      <div className="mx-4 md:mx-8 lg:mx-16 my-8 md:my-12 bg-white rounded-3xl shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-tight">
              Trusted by innovative teams at
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-center justify-center">
              {[
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Esewa_logo.webp/1100px-Esewa_logo.webp.png",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUj5QLHVwPKjiAh0x4-NfqsmpfaCNFYi6HIQ&s/100x50",
                "https://s3.amazonaws.com/resumator/customer_20191108174918_T3HDEM7NCAYEC2DB/logos/20191108184722_fusemachines_logo_jpg.jpg",
                "https://upload.wikimedia.org/wikipedia/commons/5/5b/Daraz_Logo.png",
                "https://media.licdn.com/dms/image/v2/C4E1BAQEsCT5sQW2grg/company-background_10000/company-background_10000/0/1584083622781/cotiviti_nepal__cover?e=2147483647&v=beta&t=MPhFvKGR3g14bICPWA3-o3XsCLlLRY5VKnOWHqqxFqA",
              ].map((logo, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={logo}
                    alt={`Company ${index + 1}`}
                    className="h-12 w-auto mx-auto object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
