import NavBar from "../components/NavBar";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const {
    setShowRecruiterLogin,
    setShowUserLogin,
    backendUrl,
    userToken,
    setUser,
    setUserToken,
    user,
  } = useContext(AppContext);

  console.log("The user token is ", userToken);

  // const [userData, setUser] = useState();
  // const [user, setUser] = useState({
  //   firstName: "John",
  //   lastName: "Doe",
  //   email: "john.doe@example.com",
  //   phone: "123-456-7890",
  //   dateOfBirth: "1990-01-01",
  //   gender: "Male",
  //   about:
  //     "A passionate software engineer with 5+ years of experience building web applications using modern technologies like Node.js, React, and MongoDB. Currently seeking new opportunities to lead innovative projects.",
  //   address: "1234 Elm Street, Springfield, IL, USA",
  //   image: "https://example.com/images/johndoe.jpg",
  //   experience: [
  //     {
  //       jobTitle: "Software Engineer",
  //       companyName: "Tech Corp",
  //       startDate: "2015-06-01",
  //       endDate: "2019-06-01",
  //       description:
  //         "Developed and maintained web applications using Node.js and React.",
  //     },
  //     {
  //       jobTitle: "Senior Software Engineer",
  //       companyName: "Innovative Solutions",
  //       startDate: "2019-07-01",
  //       endDate: "Present",
  //       description:
  //         "Lead the backend team to build scalable microservices using MongoDB and Express.js.",
  //     },
  //   ],
  //   education: [
  //     {
  //       institutionName: "Springfield University",
  //       degree: "BSc Computer Science",
  //       fieldOfStudy: "Computer Science",
  //       startDate: "2008-09-01",
  //       endDate: "2012-05-01",
  //       grade: "A",
  //     },
  //   ],
  //   skills: [
  //     "JavaScript",
  //     "Node.js",
  //     "React",
  //     "MongoDB",
  //     "Express.js",
  //     "Docker",
  //   ],
  // });

  const [isEditing, setIsEditing] = useState(false);

  // Handle Changes in Form Inputs
  const handleChange = (e, section, index, field) => {
    const { name, value } = e.target;

    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index][field] = value;
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add New Experience, Education, or Skill
  const handleAddField = (section) => {
    const newEntry =
      section === "experience"
        ? {
            jobTitle: "",
            companyName: "",
            startDate: "",
            endDate: "",
            description: "",
          }
        : section === "education"
        ? {
            institutionName: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            grade: "",
          }
        : "";

    setFormData({ ...formData, [section]: [...formData[section], newEntry] });
  };

  // Remove an item from experience, education, or skills
  const handleRemoveField = (section, index) => {
    const updatedSection = [...formData[section]];
    updatedSection.splice(index, 1);
    setFormData({ ...formData, [section]: updatedSection });
  };

  const [formData, setFormData] = useState(user);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 relative">
        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-lg hover:from-sky-700 hover:to-sky-500 hover:-translate-y-1 cursor-pointer shadow-lg transition"
        >
          {isEditing ? "Save Profile" : "Edit Profile"}
        </button>

        {/* Profile Header */}
        <div className="flex items-center mb-8">
          <img
            // src={user.image}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-sky-500 shadow-xl"
          />
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full text-3xl font-bold text-gray-800"
                />
              ) : (
                `${user.firstName} ${user.lastName}`
              )}
            </h1>
            <p className="text-gray-600 text-lg">
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-lg text-gray-600"
                />
              ) : (
                user.email
              )}
            </p>
            <p className="text-gray-500">
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-gray-500"
                />
              ) : (
                user.phone
              )}
            </p>
            <p className="text-gray-500">
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full text-gray-500"
                />
              ) : (
                user.address
              )}
            </p>
          </div>
        </div>

        {/* About */}
        <div className="text-gray-700">
          <p className="text-lg font-semibold">About Me:</p>
          <p className="text-gray-600 mt-2">
            {isEditing ? (
              <textarea
                value={formData.about || ""}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              user.about
            )}
          </p>
        </div>

        {/* Experience */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
          {formData.experience.map((job, index) => (
            <div
              key={index}
              className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-700">
                {isEditing ? (
                  <input
                    type="text"
                    name="jobTitle"
                    value={job.jobTitle}
                    onChange={(e) =>
                      handleChange(e, "experience", index, "jobTitle")
                    }
                    className="w-full text-xl font-bold text-gray-700"
                  />
                ) : (
                  `${job.jobTitle} at ${job.companyName}`
                )}
              </h3>
              <p className="text-gray-500">
                {isEditing ? (
                  <input
                    type="date"
                    name="startDate"
                    value={job.startDate}
                    onChange={(e) =>
                      handleChange(e, "experience", index, "startDate")
                    }
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  new Date(job.startDate).toLocaleDateString()
                )}
                {" - "}
                {isEditing ? (
                  <input
                    type="date"
                    name="endDate"
                    value={job.endDate}
                    onChange={(e) =>
                      handleChange(e, "experience", index, "endDate")
                    }
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : job.endDate === "Present" ? (
                  "Present"
                ) : (
                  new Date(job.endDate).toLocaleDateString()
                )}
              </p>
              <p className="mt-2 text-gray-600">
                {isEditing ? (
                  <textarea
                    value={job.description}
                    onChange={(e) =>
                      handleChange(e, "experience", index, "description")
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  job.description
                )}
              </p>
              {isEditing && (
                <button
                  onClick={() => handleRemoveField("experience", index)}
                  className="mt-4 text-red-500 hover:text-red-700"
                >
                  Remove Experience
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => handleAddField("experience")}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-lg shadow-lg hover:from-sky-700 hover:to-sky-500"
            >
              Add Experience
            </button>
          )}
        </div>

        {/* Education */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
          {formData.education.map((edu, index) => (
            <div
              key={index}
              className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-700">
                {isEditing ? (
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleChange(e, "education", index, "degree")
                    }
                    className="w-full text-xl font-bold text-gray-700"
                  />
                ) : (
                  `${edu.degree} in ${edu.fieldOfStudy}`
                )}
              </h3>
              <p className="text-gray-500">{edu.institutionName}</p>
              <p className="text-gray-500">
                {isEditing ? (
                  <input
                    type="date"
                    name="startDate"
                    value={edu.startDate}
                    onChange={(e) =>
                      handleChange(e, "education", index, "startDate")
                    }
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  new Date(edu.startDate).toLocaleDateString()
                )}
                {" - "}
                {isEditing ? (
                  <input
                    type="date"
                    name="endDate"
                    value={edu.endDate}
                    onChange={(e) =>
                      handleChange(e, "education", index, "endDate")
                    }
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  new Date(edu.endDate).toLocaleDateString()
                )}
              </p>
              <p className="mt-2 text-gray-600">
                {isEditing ? (
                  <input
                    type="text"
                    name="grade"
                    value={edu.grade}
                    onChange={(e) =>
                      handleChange(e, "education", index, "grade")
                    }
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  edu.grade
                )}
              </p>
              {isEditing && (
                <button
                  onClick={() => handleRemoveField("education", index)}
                  className="mt-4 text-red-500 hover:text-red-700"
                >
                  Remove Education
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => handleAddField("education")}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-lg shadow-lg hover:from-sky-700 hover:to-sky-500"
            >
              Add Education
            </button>
          )}
        </div>

        {/* Skills */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {formData.skills.map((skill, index) => (
              <div className="flex items-center gap-2" key={index}>
                <span className="text-sm bg-gray-200 text-gray-800 rounded-full px-4 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const updatedSkills = [...formData.skills];
                        updatedSkills[index] = e.target.value;
                        setFormData({ ...formData, skills: updatedSkills });
                      }}
                      className="w-full text-sm font-semibold text-gray-800 bg-transparent focus:outline-none"
                    />
                  ) : (
                    skill
                  )}
                </span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveField("skills", index)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="mt-4">
              <button
                onClick={() => handleAddField("skills")}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-lg shadow-lg hover:from-sky-700 hover:to-sky-500"
              >
                Add Skill
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
