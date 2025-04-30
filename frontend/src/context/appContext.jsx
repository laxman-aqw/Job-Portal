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
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [confirmModel, setConfirmModel] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [companyToken, setCompanyToken] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [text, setText] = useState(
    "In this Back-End Developer role, you'll build and maintain the server-side architecture of web applications. You will be responsible for integrating front-end user interfaces with back-end systems, working with technologies like Node.js, Express, and databases such as MongoDB."
  );
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

  //function to fetch user resume pdf data
  const extractResumeText = async (pdfUrl) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/job/parse-resume",
        {
          pdfUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        console.log(data);
        setText(data.text);
      } else {
        console.log("the data fetch is success");
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
    if (userToken) {
      fetchRecommendedJobs(text);
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
