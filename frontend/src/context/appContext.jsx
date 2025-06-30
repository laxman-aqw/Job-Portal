import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [pdfUrl, setPdfUrl] = useState("");

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [confirmModel, setConfirmModel] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(backendUrl);
  const [companyToken, setCompanyToken] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [text, setText] = useState(null);
  //for company data
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [userApplications, setUserApplications] = useState(false);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const storedUserToken = localStorage.getItem("userToken");

    if (storedUserToken) {
      setUserToken(storedUserToken);
    }
  }, []);

  useEffect(() => {
    const storedAdminToken = localStorage.getItem("adminToken");
    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
    }
  }, []);

  //function to fetch user resume pdf data
  const extractResumeText = async (pdfUrl) => {
    try {
      // console.log("the user token is:", userToken);
      console.log("the pdf url is:", pdfUrl);
      const { data } = await axios.post(
        backendUrl + "/api/job/parse-resume",
        { pdfUrl },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        console.log("the data is:", data);
        console.log("Extracted text:", data.text);
        setText(data.text);
        fetchRecommendedJobs(data.text);
      } else {
        console.log("Failed to extract resume text");
        toast.error("Failed to extract resume text");
      }
    } catch (error) {
      console.log("Error fetching resume:", error);
      toast.error(error.message);
    }
  };

  //function to fetch job data
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/job");
      if (data.success) {
        // console.log(data);
        setJobs(data.jobs);
      }
    } catch (error) {
      console.log("Error fetching jobs:", error);
      toast.error(error.message);
    }
  };

  //function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
      // console.log(data);
      if (data.success) {
        setCompany(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //fetchUserData
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/users/user", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (data.success) {
        // console.log(data);
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to fetch user applied applicationdatas
  const fetchUserApplications = async () => {
    try {
      console.log("token from fetchUserApplications", userToken);
      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (data.success) {
        setUserApplications(data.applications);
        // console.log("The user application data is", data.applications);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAssessments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/ai/assessments`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (data.success) {
        setAssessments(data.assessments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assessments.");
    }
  };

  const fetchRecommendedJobs = async (text) => {
    console.log("the user token from ac is:", userToken);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/job/recommend-jobs",
        {
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        setRecommendedJobs(data.jobs);
      } else {
        console.log("error fetching recommended jobs");
      }
    } catch (error) {
      console.log("Error fetching recommended jobs:", error);
      toast.error(error.message);
    }
  };

  const value = {
    userApplications,
    setUserApplications,
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    isModalOpen,
    setIsModalOpen,
    setExperiences,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    setConfirmModel,
    confirmModel,
    showUserLogin,
    setShowUserLogin,
    setUserToken,
    setUser,
    userToken,
    companyToken,
    setCompanyToken,
    company,
    setCompany,
    backendUrl,
    user,
    fetchUserData,
    fetchUserApplications,
    fetchCompanyData,
    recommendedJobs,
    setRecommendedJobs,
    fetchRecommendedJobs,
    extractResumeText,
    pdfUrl,
    setPdfUrl,
    assessments,
    setAssessments,
    fetchAssessments,
    admin,
    setAdmin,
    adminToken,
    setAdminToken,
  };

  useEffect(() => {
    if (userToken && backendUrl) fetchAssessments();
  }, [userToken, backendUrl]);

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
      console.log("the company token is: " + companyToken);
    }
  }, [companyToken]);

  // useEffect(() => {

  // }, []);

  // useEffect(() => {
  //   fetchUserData();
  // }, [userToken]);

  useEffect(() => {
    if (userToken) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [userToken]);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
