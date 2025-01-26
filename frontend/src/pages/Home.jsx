import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";

const home = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Hero></Hero>
      <JobListing></JobListing>
    </div>
  );
};

export default home;
