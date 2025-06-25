import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const { backendUrl, setCompanyToken, setCompany, setShowRecruiterLogin } =
    useContext(AppContext);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifiedData = JSON.parse(localStorage.getItem("verifiedData"));
  const { email, password, image, name } = verifiedData;

  const handleVerify = async () => {
    if (!otp) {
      toast.warning("Please enter OTP!");
      return;
    }

    try {
      const { data } = await axios.post(backendUrl + "/api/otp/verifyOTP", {
        otp,
        email,
        password,
        image,
        name,
      });

      if (data.success) {
        toast.success("Company registered successfully!");
        setCompany(data.company);
        setCompanyToken(data.token);
        localStorage.setItem("companyToken", data.token);
        localStorage.removeItem("verifiedData");
        setShowRecruiterLogin(false);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-xl shadow-lg bg-white w-[90%] max-w-md space-y-6 border border-gray-100">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-gray-800">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={otp[i] || ""}
                onChange={(e) => {
                  const newOtp = [...otp];
                  newOtp[i] = e.target.value;
                  setOtp(newOtp.join(""));
                  if (e.target.value && i < 5) {
                    e.target.nextElementSibling?.focus();
                  }
                }}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
          >
            Verify & Continue
          </button>
        </div>

        <div className="text-center text-sm text-gray-500"></div>
      </div>
    </div>
  );
};

export default VerifyOTP;
