import React from "react";
import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="flex items-center justify-center bg-white my-5">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 md:p-12">
        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Download the Mobile App for a Better Experience
          </h1>
          <p className="mt-4 text-gray-600">
            Access jobs on the go with our user-friendly app.
          </p>

          {/* App Store Buttons */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <a
              href="#"
              className="hover:opacity-80 transition transform hover:scale-105"
            >
              <img
                src={assets.play_store}
                alt="Play Store"
                className="h-12 w-auto"
              />
            </a>
            <a
              href="#"
              className="hover:opacity-80 transition transform hover:scale-105"
            >
              <img
                src={assets.app_store}
                alt="App Store"
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
