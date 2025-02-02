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

const App = () => {
  const navigate = useNavigate();
  const { showRecruiterLogin, companyToken } = useContext(AppContext);
  console.log("companyToken:", companyToken);
  const tokenValid =
    companyToken || localStorage.getItem("companyToken") ? true : false;
  console.log(tokenValid);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <Routes>
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
