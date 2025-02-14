import NavBar from "../components/NavBar";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import {
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaRegUserCircle,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { CiLinkedin } from "react-icons/ci";
import { HiDocumentArrowDown } from "react-icons/hi2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { backendUrl, user, setUser, userToken } = useContext(AppContext);
  // console.log(userToken);
  const fetchUserDataById = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/users/profile/${id}`);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDataById();
  }, [id]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 relative">
            {/* Profile Edit button */}
            {userToken && (
              <a
                href={"/update-profile"} // Adjust the link to your edit profile route
                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all"
              >
                <FaEdit className="w-5 h-5" />
                <span className="font-medium">Edit Profile</span>
              </a>
            )}
            <div className="flex flex-col md:flex-row items-start gap-8">
              {user?.image && (
                <div className="relative group shrink-0">
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-48 h-48 rounded-2xl object-cover ring-8 ring-white/90 shadow-2xl transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10" />
                </div>
              )}

              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-2xl text-indigo-600 font-medium mt-2">
                    {user?.title}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  {user?.email && (
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="w-6 h-6 text-indigo-500 shrink-0" />
                      <a
                        href={`mailto:${user.email}`}
                        className="hover:text-indigo-700 transition-colors truncate"
                      >
                        {user?.displayEmail}
                      </a>
                    </div>
                  )}

                  {user?.phone && (
                    <div className="flex items-center gap-3">
                      <FaPhoneAlt className="w-6 h-6 text-indigo-500 shrink-0" />
                      <a
                        href={`tel:${user.phone}`}
                        className="hover:text-indigo-700 transition-colors"
                      >
                        {user.phone}
                      </a>
                    </div>
                  )}

                  {user?.address && (
                    <div className="flex items-center gap-3">
                      <FaLocationDot className="w-6 h-6 text-indigo-500 shrink-0" />
                      <span className="truncate">{user.address}</span>
                    </div>
                  )}

                  {user?.gender && (
                    <div className="flex items-center gap-3">
                      <FaRegUserCircle className="w-6 h-6 text-indigo-500 shrink-0" />
                      <span>{user.gender}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <div className="flex items-center gap-4">
                    {user?.linkedInProfile && (
                      <a
                        href={user.linkedInProfile}
                        target="_blank"
                        className="p-2 rounded-lg bg-white hover:bg-indigo-50 transition-colors shadow-sm hover:shadow-md"
                      >
                        <CiLinkedin className="w-8 h-8 text-[#0A66C2]" />
                      </a>
                    )}
                    {user?.githubProfile && (
                      <a
                        href={user.githubProfile}
                        target="_blank"
                        className="p-2 rounded-lg bg-white hover:bg-indigo-50 transition-colors shadow-sm hover:shadow-md"
                      >
                        <FaGithub className="w-7 h-7 text-gray-800" />
                      </a>
                    )}
                  </div>

                  {user?.resume && (
                    <a
                      href={user.resume}
                      target="_blank"
                      className="ml-2 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <HiDocumentArrowDown className="w-6 h-6" />
                      <span className="font-semibold">View Resume</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-100">
                About
              </h2>
              <p>{user?.description}</p>
            </section>
            {/* Experience */}
            {user?.experience?.length > 0 && (
              <section className="relative">
                {userToken && (
                  <a
                    href={"/update-profile"} // Adjust the link to your edit profile route
                    className="absolute right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span className="font-medium">Add Experience</span>
                  </a>
                )}
                <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-indigo-100">
                  Professional Experience
                </h2>{" "}
                <div className="space-y-6 relative">
                  {user.experience.map((job, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      {userToken && (
                        <button
                          onClick={() => {
                            navigate(`/edit-experience/${job._id}`);
                            scrollTo(0, 0);
                          }} // Adjust the link to your edit profile route
                          className="absolute right-1 top-0 cursor-pointer flex items-center gap-2 hover:scale-105 px-4 py-2 text-indigo-600 rounded-lg transition-all"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {job.jobTitle}
                          </h3>
                          <p className="text-lg text-indigo-600 font-medium">
                            {job.companyName}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(job.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          –{" "}
                          {job.endDate === "Present" || !Date.parse(job.endDate)
                            ? "Present"
                            : new Date(job.endDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )}
                        </p>
                      </div>
                      <p className="mt-4 text-gray-600 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {user?.education?.length > 0 && (
              <section className="relative">
                {userToken && (
                  <a
                    href={"/update-profile"} // Adjust the link to your edit profile route
                    className="absolute right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span className="font-medium">Edit Education</span>
                  </a>
                )}
                <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-indigo-100">
                  Education
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {user.education.map((edu, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <h3 className="text-xl font-bold text-gray-800">
                        {edu.degree}
                      </h3>
                      <p className="text-lg text-indigo-600 font-medium mt-2">
                        {edu.institutionName}
                      </p>
                      <div className="mt-4 space-y-2 text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Field:</span>
                          {edu.fieldOfStudy}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Duration:</span>
                          {new Date(edu.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(edu.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Grade:</span>
                          {edu.grade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {user?.skills?.length > 0 && (
              <section className="relative">
                {userToken && (
                  <a
                    href={"/update-profile"} // Adjust the link to your edit profile route
                    className="absolute right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span className="font-medium">Edit Skills</span>
                  </a>
                )}
                <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-indigo-100">
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full 
                               border border-indigo-100 text-sm font-medium hover:border-indigo-200 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
