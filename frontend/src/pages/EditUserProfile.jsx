import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { assets } from "../assets/assets";
import NavBar from "../components/NavBar";
import { CiTrophy } from "react-icons/ci";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import {
  validateDisplayEmail,
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
} from "../helper/validation";
const EditUserProfile = () => {
  const navigate = useNavigate();
  const { userToken, user, setUser, backendUrl } = useContext(AppContext);
  // console.log(user, userToken);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [githubProfile, setGithubProfile] = useState("");
  const [linkedInProfile, setLinkedInProfile] = useState("");
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState("");
  const [industry, setIndustry] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateDisplayEmail(displayEmail);
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const phoneError = validatePhoneNumber(phone);

    if (emailError) {
      toast.error(emailError);
      return;
    }
    if (firstNameError) {
      toast.error(firstNameError);
      return;
    }
    if (lastNameError) {
      toast.error(lastNameError);
      return;
    }
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    //call funciton
    updateUser();
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("industry", industry);
      formData.append("lastName", lastName);
      formData.append("description", description);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("displayEmail", displayEmail);
      formData.append("githubProfile", githubProfile);
      formData.append("linkedInProfile", linkedInProfile);
      formData.append("gender", gender);
      if (image && typeof image !== "string") {
        formData.append("image", image);
      }
      NProgress.start();
      const { data } = await axios.put(
        backendUrl + "/api/users/profile-update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
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
    if (user?.firstName) {
      setFirstName(user.firstName);
    }
    if (user?.lastName) {
      setLastName(user.lastName);
    }
    if (user?.displayEmail) {
      setDisplayEmail(user.displayEmail);
    }
    if (user?.githubProfile) {
      setGithubProfile(user.githubProfile);
    }
    if (user?.linkedInProfile) {
      setLinkedInProfile(user.linkedInProfile);
    }
    if (user?.phone) {
      setPhone(user.phone);
    }
    if (user?.address) {
      setAddress(user.address);
    }
    if (user?.gender) {
      setGender(user.gender);
    }
    if (user?.description) {
      setDescription(user.description);
    }
    if (user?.image) {
      setImage(user.image);
    }
    if (user?.industry) {
      setIndustry(user.industry);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setDescription(user.description || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setDisplayEmail(user.displayEmail || "");
      setGithubProfile(user.githubProfile || "");
      setLinkedInProfile(user.linkedInProfile || "");
      setGender(user.gender || "");
      setGender(user.industry || "");
      setImage(user.image || null);
    }
  }, [user]);

  return (
    <div>
      <NavBar />
      <div className="max-w-2xl mx-auto my-12 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
        {/* Animated background element */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 relative">
          Edit User Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          {/* Name Input */}
          <div className="flex w-full gap-3 justify-around">
            <div className="group w-full relative">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
                First Name
              </label>
            </div>
            <div className="group w-full relative">
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
                Last Name
              </label>
            </div>
          </div>
          <div className="flex w-full gap-3 justify-around">
            <div className="group w-full relative">
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
                Phone Number
              </label>
            </div>

            <div className="group w-full relative">
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
                Addresss
              </label>
            </div>
          </div>

          <div className="group w-full relative">
            <input
              type="text"
              name="displayEmail"
              value={displayEmail}
              onChange={(e) => setDisplayEmail(e.target.value)}
              className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
              Profile Email
            </label>
          </div>

          <div className="group w-full relative">
            <input
              type="text"
              name="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
              Industry
            </label>
          </div>

          <div className="group w-full relative">
            <input
              type="text"
              name="githubProfile"
              value={githubProfile}
              onChange={(e) => setGithubProfile(e.target.value)}
              className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
              Github Profile link
            </label>
          </div>

          <div className="group w-full relative">
            <input
              type="text"
              name="linkedInProfile"
              value={linkedInProfile}
              onChange={(e) => setLinkedInProfile(e.target.value)}
              className="w-full px-5 py-3.5 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder-transparent peer"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-blue-600">
              LinkedInProfile link
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

          <div className="w-full relative">
            <p className="absolute left-4 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-300">
              Gender
            </p>
            <div className="flex gap-6 px-5 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="peer hidden"
                />
                <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all">
                  <span className="w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all"></span>
                </span>
                Male
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="peer hidden"
                />
                <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all">
                  <span className="w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all"></span>
                </span>
                Female
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                  className="peer hidden"
                />
                <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all">
                  <span className="w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all"></span>
                </span>
                Other
              </label>
            </div>
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
                <p className="text-sm font-medium text-gray-700">
                  Company Logo
                </p>
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
    </div>
  );
};

export default EditUserProfile;
