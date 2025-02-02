import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { IoPersonOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/appContext";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordRequirement,
} from "../helper/validation";
const RecruiterLogin = () => {
  const navigate = useNavigate();
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompany } =
    useContext(AppContext);
  const [state, setState] = useState("Login");
  const [name, setName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  let [isNextDataSubmitted, setIsNextDataSubmitted] = useState(false);
  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = validateName(name);
    const emailValidateError = validatePasswordRequirement(password);

    if (state === "Sign Up" && nameError) {
      toast.error(nameError);
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
        const { data } = await axios.post(
          backendUrl + "/api/company/check-email",
          { email }
        );
        if (data.exists) {
          toast.error("Company with this email address is already registered.");
          return;
        }
        setLoading(false);
        return setIsNextDataSubmitted(true);
      } catch (error) {
        toast.error("An error occurred while checking email.");
        console.log(error);
      }
    }
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success("Logged in successfully!");
          console.log("data succeed");
          setCompany(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData
        );
        if (data.success) {
          toast.success("Company registered successfully!");
          console.log("data succeed");
          setCompany(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
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
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1
          className="text-center text-2xl text-neutral-700 font-medium
         "
        >
          Recruiter {state}
        </h1>
        {state == "Login" ? (
          <p className="text-sm">Welcome back! Please sign in to continue</p>
        ) : (
          <p className="text-sm text-center">
            Enter Your Details to Get Started{" "}
          </p>
        )}

        {state === "Sign Up" && isNextDataSubmitted ? (
          <>
            <div className="flex items-center gap-4 m-5">
              <label className="cursor-pointer" htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
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
          </>
        ) : (
          <>
            <>
              {state !== "Login" && (
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500">
                  <IoPersonOutline />
                  <input
                    className="outline-none text-sm w-full"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Company Name"
                  />
                </div>
              )}

              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500">
                <TfiEmail />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                  placeholder="Email address"
                />
              </div>
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500">
                <CiLock />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="text"
                  placeholder="Password"
                />
              </div>
            </>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm mt-2 text-sky-700 hover:underline cursor-pointer">
            Forgot password?
          </p>
        )}
        <button
          type="submit"
          className=" text-white w-full px-5 hover:scale-105 py-2 rounded-full  bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 cursor-pointer mt-3 "
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
        {state === "Login" ? (
          <p
            onClick={() => setState("Sign Up")}
            className="text-sm text-sky-700 mt-2 hover:underline cursor-pointer"
          >
            Don't have an account? <span>Sign Up</span>
          </p>
        ) : (
          <p
            onClick={() => setState("Login")}
            className="text-sm mt-2 text-sky-700  hover:underline cursor-pointer"
          >
            Already have an account? <span>Login</span>
          </p>
        )}
        <IoCloseOutline
          onClick={(e) => setShowRecruiterLogin(false)}
          className=" hover:text-red-400 hover:scale-110 absolute top-5 text-2xl right-5 cursor-pointer"
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
