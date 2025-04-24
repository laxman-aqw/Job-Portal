import React, { useContext, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import ManageJobs from "./pages/ManageJobs";
import ViewApplication from "./pages/ViewApplication";
import RecruiterLogin from "./components/RecruiterLogin";
import AddJob from "./pages/AddJob";
import { AppContext } from "./context/appContext";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import AddJob from "./pages/addJob";
import Dashboard from "./pages/Dashboard";
import UserLogin from "./components/UserLogin";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import default NProgress styles
import "./custom/custom.css";
import ProfilePage from "./pages/ProfilePage";
import EditJob from "./pages/EditJob";
import CompanyProfile from "./pages/CompanyProfile";
import EditCompanyProfile from "./pages/EditCompanyProfile";
import EditUserProfile from "./pages/EditUserProfile";
import EditExperience from "./components/EditExperience";
import AddExperience from "./components/addExperience";
import ConfirmModel from "./components/ConfirmationModel";
import AddEducation from "./components/AddEducation";
import EditEducation from "./components/EditEducation";
import DelEduConModel from "./components/DelEduConModel";
import VerifyOtp from "./pages/VerifyOtp";
import CoverLettersPage from "./pages/cover-letter/CoverLettersPage";
import CoverLetter from "./pages/cover-letter/CoverLetter";
const App = () => {
  const {
    showRecruiterLogin,
    confirmModel,
    showUserLogin,
    companyToken,
    userToken,
  } = useContext(AppContext);
  // console.log("companyToken:", companyToken);
  const companyValidToken =
    companyToken || localStorage.getItem("companyToken");
  const userValidToken = userToken || localStorage.getItem("userToken");

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      {showUserLogin && <UserLogin />}
      {confirmModel && <ConfirmModel />}
      {confirmModel && <DelEduConModel />}
      <Routes>
        <Route
          path="/"
          element={companyValidToken ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route path="/profile/:id" element={<ProfilePage></ProfilePage>} />
        <Route path="/verifyOtp" element={<VerifyOtp></VerifyOtp>} />
        <Route
          path="/edit-experience/:id"
          element={
            userValidToken ? <EditExperience></EditExperience> : <Home></Home>
          }
        />
        <Route
          path="/ai-cover-letter/"
          element={
            userValidToken ? (
              <CoverLettersPage></CoverLettersPage>
            ) : (
              <Home></Home>
            )
          }
        />
        <Route
          path="/ai-cover-letter/:id"
          element={userValidToken ? <CoverLetter></CoverLetter> : <Home></Home>}
        />
        <Route
          path="/edit-education/:id"
          element={
            userValidToken ? <EditEducation></EditEducation> : <Home></Home>
          }
        />
        <Route
          path="/add-experience"
          element={
            userValidToken ? <AddExperience></AddExperience> : <Home></Home>
          }
        />
        <Route
          path="/add-education"
          element={
            userValidToken ? <AddEducation></AddEducation> : <Home></Home>
          }
        />
        <Route path="/" element={<Home></Home>} />
        <Route path="/apply-job/:id" element={<ApplyJob></ApplyJob>} />
        <Route
          path="/applications"
          element={
            userValidToken ? <Applications></Applications> : <Home></Home>
          }
        />
        <Route
          path="/update-profile"
          element={
            userValidToken ? <EditUserProfile></EditUserProfile> : <Home></Home>
          }
        />
        {companyValidToken ? (
          <Route path="/dashboard" element={<Dashboard></Dashboard>}>
            <>
              <Route index element={<Navigate to="manage-jobs" />} />
              <Route path="add-job" element={<AddJob></AddJob>} />
              <Route
                path="company-profile/:id"
                element={<CompanyProfile></CompanyProfile>}
              />
              <Route path="edit-job/:id" element={<EditJob></EditJob>} />
              <Route
                path="edit-profile"
                element={<EditCompanyProfile></EditCompanyProfile>}
              />
              <Route path="manage-jobs" element={<ManageJobs></ManageJobs>} />
              <Route
                path="view-applications"
                element={<ViewApplication></ViewApplication>}
              />
            </>
          </Route>
        ) : (
          <Route path="/dashboard" element={<Navigate to="/" />} />
        )}
        ;
      </Routes>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default App;
