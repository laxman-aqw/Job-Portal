import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { IoPersonOutline } from "react-icons/io5";
import { FaEnvelope } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/appContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import {
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
  validatePasswordRequirement,
} from "../helper/validation";
const UserLogin = () => {
  const navigate = useNavigate();
  const { setShowUserLogin, backendUrl, setUserToken, setUser, user } =
    useContext(AppContext);
  const [state, setState] = useState("Login");
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  let [isNextDataSubmitted, setIsNextDataSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const emailValidateError = validatePasswordRequirement(password);

    if (state === "Sign Up" && firstNameError) {
      toast.error(firstNameError);
      setLoading(false);
      return;
    }

    if (state === "Sign Up" && lastNameError) {
      toast.error(lastNameError);
      setLoading(false);
      return;
    }

    if (emailError) {
      console.log("Email error here");
      toast.error(emailError);
      setLoading(false);
      return;
    }

    if (state === "Sign Up" && emailValidateError) {
      toast.error(emailValidateError);
      setLoading(false);
      return;
    }

    if (passwordError) {
      console.log("password error here");
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    if (state === "Sign Up" && !isNextDataSubmitted) {
      try {
        NProgress.start();
        const { data } = await axios.post(
          backendUrl + "/api/users/check-email",
          { email }
        );
        if (data.exists) {
          toast.error("User with this email address is already registered.");
          return;
        }
        setLoading(false);
        return setIsNextDataSubmitted(true);
      } catch (error) {
        toast.error("An error occurred while checking email.");
        console.log(error);
      } finally {
        NProgress.done();
        setLoading(false);
      }
    }
    try {
      if (state === "Login") {
        NProgress.start();
        const { data } = await axios.post(backendUrl + "/api/users/login", {
          email,
          password,
        });
        console.log(data);
        if (data.success) {
          toast.success("Logged in successfully!");
          setUser(data.user);
          console.log("The user data is", user);
          setUserToken(data.token);
          localStorage.setItem("userToken", data.token);

          setShowUserLogin(false);
          navigate("/");
        }
      } else {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        NProgress.start();
        const { data } = await axios.post(
          backendUrl + "/api/users/register",
          formData
        );
        if (data.success) {
          toast.success("User registered successfully!");
          console.log("data succeed");
          setUser(data.user);
          setUserToken(data.token);
          localStorage.setItem("userToken", data.token);
          setShowUserLogin(false);
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password!");
      } else if (error.response.status === 409) {
        toast.error(error.response?.data?.message || "Email already exists.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    } finally {
      NProgress.done();
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // toggle the visibility state
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Close Button */}
        <IoCloseOutline
          onClick={(e) => setShowUserLogin(false)}
          className="absolute top-6 right-6 text-2xl text-gray-500 hover:text-red-500 cursor-pointer transition-all hover:scale-110"
        />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User {state}
          </h1>
          <p className="text-sm text-gray-500">
            {state === "Login"
              ? "Welcome back! Please sign in to continue"
              : "Enter Your Details to Get Started"}
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          {state === "Sign Up" && isNextDataSubmitted ? (
            // Image Upload Section
            <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 group-hover:border-sky-500 transition-colors overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      image ? URL.createObjectURL(image) : assets.upload_area
                    }
                    alt="Profile Picture"
                  />
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  id="image"
                  type="file"
                  hidden
                  accept="image/png, image/jpeg"
                />
              </label>
              <p className="text-sm text-gray-600">Upload profile picture</p>
            </div>
          ) : (
            // Main Form Fields
            <>
              {state !== "Login" && (
                <div className="space-y-3">
                  <div className="bg-gray-50 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-sky-500 transition-all">
                    <div className="flex items-center gap-3">
                      <IoPersonOutline className="text-gray-500 text-lg" />
                      <input
                        className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        type="text"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-sky-500 transition-all">
                    <div className="flex items-center gap-3">
                      <IoPersonOutline className="text-gray-500 text-lg" />
                      <input
                        className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        type="text"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-sky-500 transition-all">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-500 text-lg" />
                  <input
                    className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-sky-500 transition-all">
                <div className="flex items-center gap-3 relative">
                  <FaUnlockAlt className="text-gray-500 text-lg" />
                  <input
                    className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"} // toggle between text and password type
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute cursor-pointer p-1 rounded-full hover:bg-gray-200 right-3 text-gray-500"
                  >
                    {showPassword ? (
                      <IoEyeOutline className="text-lg" />
                    ) : (
                      <IoEyeOffOutline className="text-lg" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Forgot Password */}
          {state === "Login" && (
            <p className="text-right text-sm text-sky-600 hover:text-sky-700 hover:underline cursor-pointer transition-colors">
              Forgot password?
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium hover:from-sky-600 hover:to-sky-500 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-sky-200 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-1"
            disabled={loading}
          >
            {loading
              ? "Signing Up..."
              : state === "Login"
              ? "Login"
              : isNextDataSubmitted
              ? "Sign Up"
              : "Next"}
          </button>

          {/* Toggle Between Login/Signup */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {state === "Login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span
              onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
              className="text-sky-600 hover:text-sky-700 cursor-pointer hover:underline"
            >
              {state === "Login" ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
