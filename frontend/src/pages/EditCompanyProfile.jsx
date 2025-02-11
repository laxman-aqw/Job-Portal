import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
// Sample company data (Replace with API data if needed)

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const { company, companyToken, backendUrl } = useContext(AppContext);
  console.log("Company Token is: ", companyToken);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [companyData, setCompanyData] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany();
  };

  const updateCompany = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image && typeof image !== "string") {
        formData.append("image", image);
      }
      NProgress.start();
      const { data } = await axios.put(
        backendUrl + `/api/company/update-company`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        console.log(data);
        navigate(`/dashboard/company-profile/${company._id}`);
      }
    } catch (error) {
      console.log("Error updating company:", error);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    if (company) {
      setCompanyData(company);
    }
    if (companyData?.name) {
      setName(company.title);
    }
    if (companyData?.description) {
      setDescription(company.description);
    }
    if (companyData?.image) {
      setImage(company.image);
    }
  }, [company]);

  useEffect(() => {
    if (company) {
      setCompanyData(company);
      setName(company.name || "");
      setDescription(company.description || "");
      setImage(company.image || null);
    }
  }, [company]);

  // useEffect(() => {
  //   fetchCompanyData();
  // }, [companyToken]);
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
      {/* Animated background element */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 relative">
        Edit Company Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 relative">
        {/* Name Input */}
        <div className="group relative">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
            placeholder=" "
          />
          <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
            Company Name
          </label>
        </div>

        {/* Description Input */}
        <div className="group relative">
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer min-h-[120px] resize-none"
            placeholder=" "
          />
          <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
            Description
          </label>
        </div>

        {/* Image Upload */}
        <div className="relative group">
          <label className="flex items-center gap-6 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer shadow-sm hover:shadow-md">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-blue-400 overflow-hidden transition-all">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={
                    image
                      ? typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                      : assets.upload_area
                  }
                  alt="Company logo"
                />
              </div>
              <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Company Logo</p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 500×500 PNG/JPG
              </p>
              <p className="text-xs  text-blue-500 mt-2 hover:text-blue-600 transition-colors">
                Click to upload
              </p>
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              id="image"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
            />
          </label>
        </div>

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
  );
};

export default EditCompanyProfile;
