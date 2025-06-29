import React, { useState, useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { IoPersonOutline } from "react-icons/io5";
import { FaEnvelope } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/appContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../../custom/custom.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { validateEmail, validatePassword } from "../../helper/validation";
const AdminLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setAdmin, admin, setAdminToken } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
      console.log("Email error here");
      toast.error(emailError);
      setLoading(false);
      return;
    }

    if (passwordError) {
      console.log("password error here");
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    try {
      NProgress.start();
      const { data } = await axios.post(backendUrl + "/api/admin/login", {
        email,
        password,
      });
      console.log(data);
      if (data.success) {
        toast.success("Logged in successfully!");
        setAdmin(data.admin);
        console.log("The admin data is", admin);
        setAdminToken(data.token);
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
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
    setShowPassword((prev) => !prev);
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

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-sm text-gray-500">
            Welcome back admin! Please sign in to continue
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium hover:from-sky-600 hover:to-sky-500 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-sky-200 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-1"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
