import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { assets, JobCategories, JobLocations } from "../assets/assets";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Added state to capture description
  const [location, setLocation] = useState("Kathmandu");
  const [category, setCategory] = useState("IT");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null); // Ref for Quill editor
  const quillRef = useRef(null); // Ref to hold the Quill instance

  useEffect(() => {
    // Initialize Quill editor only once
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      // Set up an event listener to update the description state on text change
      quillRef.current.on("text-change", () => {
        setDescription(quillRef.current.root.innerHTML); // Sync content with the state
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the data (e.g., send it to an API)
    console.log({
      title,
      description, // This will contain the HTML content of the editor
      location,
      category,
      level,
      salary,
    });
  };

  return (
    <form
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
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
          required
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
          className="text-white px-5 cursor-pointer py-2 rounded-md hover:scale-105  bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300"
        >
          Add Job
        </button>
      </div>
    </form>
  );
};

export default AddJob;
