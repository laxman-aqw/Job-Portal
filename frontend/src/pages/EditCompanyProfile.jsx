import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

// Sample company data (Replace with API data if needed)

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const { company, setCompany, companyToken, fetchCompanyData, backendUrl } =
    useContext(AppContext);
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
  }, []);

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
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        Edit Company Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-gray-700 font-medium">
            Company Name:
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-gray-700 font-medium">
            Description:
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-4 m-5">
          <label className="cursor-pointer" htmlFor="image">
            <img
              className="w-16 rounded-full"
              src={
                image
                  ? typeof image === "string"
                    ? image
                    : URL.createObjectURL(image)
                  : assets.upload_area
              }
              alt=""
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              id="image"
              type="file"
              hidden
              accept="image/png, image/jpeg"
            />
          </label>
          <p>Upload company logo</p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCompanyProfile;
