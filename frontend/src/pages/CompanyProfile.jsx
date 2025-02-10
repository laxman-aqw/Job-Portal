import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/appContext";
import JobCard from "../components/JobCard";
import { assets } from "../assets/assets";
import { CiEdit } from "react-icons/ci";
import Loading from "../components/Loading";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [companyData, setCompanyData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/company-profile/${id}`
      );
      if (data.success) {
        setCompanyData(data.company);
        setJobs(data.company?.jobs || []);
      } else {
        console.error("Error fetching company details");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  if (loading) return <Loading></Loading>;

  if (!companyData)
    return (
      <p className="text-center text-red-500 text-lg mt-10">
        Company not found
      </p>
    );

  return (
    <div className=" rounded-lg lg:px-30 ">
      {/* Background Image & Company Image Section */}
      <div className="relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/29/b6/ec/29b6ecc1dd118072a60e814326c1215d.jpg')`,
            height: "250px",
          }}
        ></div>

        {/* Company Details Section */}
        <div className="relative z-10 flex flex-col items-start pt-35">
          {/* Profile Image */}
          <img
            src={companyData?.image}
            alt={companyData?.name}
            className="w-32 h-32 ml-2 rounded-full object-cover border-4 border-white shadow-xl"
          />

          {/* Company Name */}
          <div className="bg-white w-full pt-0 p-4 mt-3 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mt-4 text-gray-700">
                {companyData?.name}
              </h2>

              {/* Company Email */}
              <p className="text-gray-500 text-lg">{companyData?.email}</p>
            </div>
            <div>
              <button
                onClick={(e) => navigate("/dashboard/edit-profile")}
                className="hover:bg-gray-200 hover:scale-105 cursor-pointer flex items-center gap-2 border-gray-500 text-gray-700 text-lg px-2 py-1 rounded-lg border-2 transition-all"
              >
                <CiEdit /> Edit profile
              </button>
            </div>
          </div>

          {/* About Company Section */}
          <div className="bg-white w-full p-4 mt-3 rounded-lg">
            <h1 className="text-3xl w-full font-semibold text-left mt-6 text-gray-700">
              About {companyData?.name}
            </h1>
            {companyData?.description && (
              <p className="text-gray-700 text-justify mt-2   text-sm">
                {companyData?.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white w-full p-4 mt-5 rounded-lg ">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
          {companyData?.name} Job Openings
        </h3>
        {jobs.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No active job listings.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
