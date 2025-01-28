import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/appContext";

const App = () => {
  const { showRecruiterLogin, setShowRecruiterLogin } = useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin></RecruiterLogin>}
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/apply-job/:id" element={<ApplyJob></ApplyJob>} />
        <Route path="/applications" element={<Applications></Applications>} />
      </Routes>
    </div>
  );
};

export default App;
