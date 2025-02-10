import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [companyToken, setCompanyToken] = useState(null);
  const [userToken, setUserToken] = useState(null);

  //for company data
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [userApplications, setUserApplications] = useState(false);

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
        console.log(data);
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
        console.log("The user application data is", data.applications);
      }
    } catch (error) {
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
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
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
  };

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, [companyToken]);

  useEffect(() => {
    const storedUserToken = localStorage.getItem("userToken");

    if (storedUserToken) {
      setUserToken(storedUserToken);
    }
  }, []);

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
    if (user) {
      console.log("The user is", user);
    }
  }, [user]);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
