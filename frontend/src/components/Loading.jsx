import React from "react";

const Loading = () => {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 relative animate-spin">
          <div className="absolute w-4 h-4 bg-sky-700 top-0 left-0"></div>
          <div className="absolute w-4 h-4 bg-sky-600 top-0 right-0"></div>
          <div className="absolute w-4 h-4 bg-sky-500 bottom-0 left-0"></div>
          <div className="absolute w-4 h-4 bg-sky-400 bottom-0 right-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
