import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/apply-job/:id" element={<ApplyJob></ApplyJob>} />
        <Route path="/applications" element={<Applications></Applications>} />
      </Routes>
    </div>
  );
};

export default App;
