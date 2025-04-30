import React, { useContext, useEffect, useState } from "react";
import Quiz from "../../components/Quiz";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import AssessmentDashboard from "../../components/AssessmentDashboard";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const InterviewPage = () => {
  const { backendUrl, userToken, assessments, setAssessments } =
    useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content Section */}
      <main className="max-w-6xl mx-auto p-2 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2 sm:mb-2">
          Interview Preparation
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-2 sm:mb-">
          Prepare yourself with a personalized quiz to test your skills and
          knowledge. Get instant feedback and tips for improvement.
        </p>
        <AssessmentDashboard assessments={assessments} />
        {/* Quiz Section */}
        <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-md">
          <Quiz />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InterviewPage;
