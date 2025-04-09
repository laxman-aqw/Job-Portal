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

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP!");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/otp/verifyOTP",
        { otp }, // No email needed since it's in session
        { withCredentials: true } // Important for sessions!
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
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <button
        onClick={handleVerify}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default VerifyOTP;
