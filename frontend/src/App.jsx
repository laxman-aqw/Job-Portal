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

const App = () => {
  const { showRecruiterLogin, showUserLogin, companyToken, userToken } =
    useContext(AppContext);
  // console.log("companyToken:", companyToken);
  const tokenValid =
    companyToken || localStorage.getItem("companyToken") ? true : false;

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      {showUserLogin && <UserLogin />}
      <Routes>
        <Route path="/profile" element={<ProfilePage></ProfilePage>} />
        <Route path="/" element={<Home></Home>} />
        <Route path="/apply-job/:id" element={<ApplyJob></ApplyJob>} />
        <Route path="/applications" element={<Applications></Applications>} />
        {tokenValid ? (
          <Route path="/dashboard" element={<Dashboard></Dashboard>}>
            <>
              <Route index element={<Navigate to="manage-jobs" />} />
              <Route path="add-job" element={<AddJob></AddJob>} />
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
