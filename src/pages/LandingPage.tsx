import { useEffect } from "react";
import BottomFooter from "../components/Common/BottomFooter";
import Navbar from "../components/Common/TopNavbar";
import ContactUs from "../components/LandingPage/ContactUs/ContactUs";

import Features from "../components/LandingPage/Features/Features";
import Header from "../components/LandingPage/Header";
import Metrics from "../components/LandingPage/Metrics/Metrics";
import Workflow from "../components/LandingPage/Workflow/Workflow";

function LandingPage() {
  useEffect(() => {
    document.title = `blit.ai • The #1 cloud-based RF simulation platform`;
  });
  return (
    <>
      <div className="bg-gray-50">
        <Navbar />
        <Header />
      </div>
      <Features />
      <Workflow />
      <Metrics />
      <div style={{ height: "100px" }}></div>
      <ContactUs />
      <BottomFooter />
    </>
  );
}

export default LandingPage;
