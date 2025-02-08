import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  validateJobTitle,
  validateJobDescription,
  validateJobSalary,
} from "../helper/validation";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Kathmandu");
  const [category, setCategory] = useState("IT");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState();
  const [deadline, setDeadline] = useState(0);
  const [loading, setLoading] = useState(false);
  const { backendUrl, companyToken } = useContext(AppContext);
  const [jobData, setJobData] = useState(null);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/job/${id}`);
      if (data.success) {
        console.log(data);
        setJobData(data.job);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const titleError = validateJobTitle(title);
    const descriptionError = validateJobDescription(title);
    const salaryError = validateJobSalary(salary);
    if (titleError) {
      toast.error(titleError);
      return;
    }

    if (descriptionError) {
      toast.error(descriptionError);
      return;
    }
    if (salaryError) {
      toast.error(salaryError);
      return;
    }

    setLoading(true);

    try {
      NProgress.start();
      const { data } = await axios.put(
        backendUrl + `/api/job/update-job/${id}`,
        {
          title,
          description,
          salary,
          category,
          level,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      if (data.success) {
        setLoading(false);
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        navigate("/dashboard/manage-jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the job");
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      NProgress.done();
    }
  };

  const handleDateChange = (date) => {
    let isoDate = date.toISOString();
    setDeadline(isoDate);
    console.log(deadline);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (jobData?.title) {
      setTitle(jobData.title);
    }
    if (jobData?.category) {
      setCategory(jobData.category);
    }
    if (jobData?.location) {
      setLocation(jobData.location);
    }
    if (jobData?.level) {
      setLevel(jobData.level);
    }
    if (jobData?.deadline) {
      setDeadline(jobData.deadline);
    }
    if (jobData?.salary) {
      setSalary(jobData.salary);
    }
    if (jobData?.description) {
      setDescription(jobData.description);
    }
  }, [jobData]);

  return (
    <form
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      onSubmit={onSubmitHandler}
    >
      <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
        Edit Job
      </h2>

      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2" htmlFor="title">
          Job Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter job title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-600 font-medium mb-2"
          htmlFor="description"
        >
          Job Description
        </label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          className="h-auto border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="category"
          >
            Job Category
          </label>
          <select
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="location"
          >
            Job Location
          </label>
          <select
            id="location"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div>
          <label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="level"
          >
            Job Level
          </label>
          <select
            id="level"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div className="w-full">
          <label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="deadline"
          >
            Deadline
          </label>
          <DatePicker
            placeholder="YYYY-MM-DD"
            selected={deadline}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="salary"
          >
            Job Salary
          </label>
          <input
            id="salary"
            type="number"
            placeholder="Enter salary"
            onChange={(e) => setSalary(e.target.value)}
            value={salary}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="text-white px-5 font-semibold cursor-pointer py-2 rounded-md hover:scale-105  bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
        >
          {loading ? "Updating.." : "Update"}
        </button>
      </div>
    </form>
  );
};

export default EditJob;
