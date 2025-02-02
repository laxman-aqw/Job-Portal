import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  validateJobTitle,
  validateJobDescription,
  validateJobSalary,
} from "../helper/validation";

const AddJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Added state to capture description
  const [location, setLocation] = useState("Kathmandu");
  const [category, setCategory] = useState("IT");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState();
  const [deadline, setDeadline] = useState(0);
  const [loading, setLoading] = useState(false);
  const { backendUrl, companyToken } = useContext(AppContext);

  const editorRef = useRef(null); // Ref for Quill editor
  const quillRef = useRef(null); // Ref to hold the Quill instance

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
      const description = quillRef.current.root.innerHTML;
      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
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
        quillRef.current.setContents([]);
        navigate("/dashboard/manage-jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the job");
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    // Initialize Quill editor only once
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      onSubmit={onSubmitHandler}
    >
      <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
        Add New Job
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
        <div
          ref={editorRef}
          className="h-48 border border-gray-300 rounded-md"
        ></div>
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

      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2" htmlFor="level">
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

      <div className="text-center">
        <button
          type="submit"
          className="text-white px-5 font-semibold cursor-pointer py-2 rounded-md hover:scale-105  bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
        >
          {loading ? "Adding Job..." : "Add Job"}
        </button>
      </div>
    </form>
  );
};

export default AddJob;
