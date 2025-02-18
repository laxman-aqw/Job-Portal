import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { assets } from "../assets/assets";
import NavBar from "./NavBar";
import { CiTrophy } from "react-icons/ci";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import DatePicker from "react-datepicker";
import {
  validateDegree,
  validateFieldOfStudy,
  validateInstitutionName,
  validateGrade,
  validateEducationDates,
} from "../helper/validation";
const EditEducation = () => {
  const { id } = useParams();
  const today = new Date();
  const navigate = useNavigate();
  const { userToken, user, setUser, backendUrl } = useContext(AppContext);
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [grade, setGrade] = useState("");
  const [institutionName, setInstitutionName] = useState(null);
  const [edu, setEdu] = useState(null);

  const fetchEdu = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + `/api/users/profile-education/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        console.log(data.education);
        setEdu(data.education);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const degreeError = validateDegree(degree);
    const fieldOfStudyError = validateFieldOfStudy(fieldOfStudy);
    const institutionError = validateInstitutionName(institutionName);
    const gradeError = validateGrade(grade);
    const datesError = validateEducationDates(startDate, endDate);

    if (degreeError) {
      toast.error(degreeError);
      return;
    }
    if (fieldOfStudyError) {
      toast.error(fieldOfStudyError);
      return;
    }
    if (institutionError) {
      toast.error(institutionError);
      return;
    }
    if (gradeError) {
      toast.error(gradeError);
      return;
    }
    if (datesError) {
      toast.error(datesError);
      return;
    }
    updateEdu();
  };

  const updateEdu = async () => {
    try {
      const updateData = {
        degree,
        fieldOfStudy,
        institutionName,
        startDate,
        endDate,
        grade,
      };
      NProgress.start();

      const { data } = await axios.put(
        backendUrl + `/api/users/edit-education/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        console.log(data);
        navigate(`/profile/${user._id}`);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Error updating education details:", err);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    if (edu) {
      setDegree(edu.degree || "");
      setFieldOfStudy(edu.fieldOfStudy || "");
      setInstitutionName(edu.institutionName || "");
      setEndDate(edu.endDate || "");
      setStartDate(edu.startDate || "");
      setGrade(edu.grade || "");
    }
  }, [edu]);

  useEffect(() => {
    if (id && userToken) {
      fetchEdu();
    }
  }, [id, userToken]);

  return (
    <div>
      <NavBar />
      <div className="max-w-2xl mx-auto my-12 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
        {/* Animated background element */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 relative">
          Edit Education Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          {/* Name Input */}
          <div className="flex w-full gap-3 justify-around">
            <div className="group w-full relative">
              <input
                type="text"
                name="degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600 pointer-events-none">
                Degree
              </label>
            </div>
            <div className="group w-full relative">
              <input
                type="text"
                name="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600 pointer-events-none">
                Field Of Study
              </label>
            </div>
          </div>
          <div className="flex w-full gap-3 justify-around">
            <div className="group w-full relative">
              <input
                type="text"
                name="institutionName"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600 pointer-events-none">
                Institution Name
              </label>
            </div>
            <div className="group w-full relative">
              <input
                type="Number"
                name="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600 pointer-events-none">
                Grade
              </label>
            </div>
          </div>

          {/* Description Input */}

          <div className="flex w-full gap-3">
            <div className="w-full flex flex-col">
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="deadline"
              >
                Start Date
              </label>
              <DatePicker
                placeholderText="YYYY-MM-DD"
                selected={startDate}
                maxDate={today}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="w-full flex flex-col">
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="deadline"
              >
                End Date
              </label>
              <DatePicker
                placeholderText="YYYY-MM-DD"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 cursor-pointer px-6 bg-gradient-to-r  from-blue-500 to-cyan-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-hidden"
          >
            <span className="relative z-10">Save Changes</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
          </button>
        </form>

        {/* Decorative border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/80 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default EditEducation;
