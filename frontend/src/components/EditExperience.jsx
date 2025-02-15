import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { assets } from "../assets/assets";
import NavBar from "../components/NavBar";
import { CiTrophy } from "react-icons/ci";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import DatePicker from "react-datepicker";

const EditExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, user, setUser, backendUrl } = useContext(AppContext);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [exp, setExp] = useState(null);

  const fetchExp = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + `/api/users/profile-experience/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        console.log(data.experience);
        setExp(data.experience);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateExps();
  };

  const updateExps = async () => {
    try {
      const updateData = {
        jobTitle,
        companyName,
        description,
        startDate,
        endDate,
      };
      NProgress.start();

      const { data } = await axios.put(
        backendUrl + `/api/users/edit-experience/${id}`,
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
      console.error("Error updating profile:", err);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    if (id && userToken) {
      fetchExp();
    }
  }, [id, userToken]);

  useEffect(() => {
    if (exp) {
      setJobTitle(exp.jobTitle || "");
      setCompanyName(exp.companyName || "");
      setDescription(exp.description || "");
      setEndDate(exp.endDate || "");
      setStartDate(exp.startDate || "");
    }
  }, [exp]);

  return (
    <div>
      <NavBar />
      <div className="max-w-2xl mx-auto my-12 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
        {/* Animated background element */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 relative">
          Edit Job Experience
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          {/* Name Input */}
          <div className="flex w-full gap-3 justify-around">
            <div className="group w-full relative">
              <input
                type="text"
                name="firstName"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
                JobTitle
              </label>
            </div>
            <div className="group w-full relative">
              <input
                type="text"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
                Company Name
              </label>
            </div>
          </div>

          {/* Description Input */}
          <div className="group relative">
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer min-h-[120px] resize-y"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
              Description
            </label>
          </div>

          <div className="flex w-full gap-3">
            <div className="w-full">
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="deadline"
              >
                Start Date
              </label>
              <DatePicker
                placeholder="YYYY-MM-DD"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="w-full">
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="deadline"
              >
                End Date
              </label>
              <DatePicker
                placeholder="YYYY-MM-DD"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* start date */}

          {/* Image Upload */}

          {/* Save Button */}
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

export default EditExperience;
