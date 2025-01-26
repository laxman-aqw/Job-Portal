import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";

const home = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Hero></Hero>
      <JobListing></JobListing>
      <AppDownload></AppDownload>
      <Footer></Footer>
    </div>
  );
};

export default home;
