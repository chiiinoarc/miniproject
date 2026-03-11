import React from "react";
import Navbar from "../components/NavBar";
import logo from "../assets/logo.png";
import Login from "../PagesLogin.jsx";

function Landing() {
  const items = [
    {
      label: "About",
      bgColor: "#7B8070",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" },
      ],
    },
    {
      label: "Projects",
      bgColor: "#484B42",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#3F4F3B",
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" },
      ],
    },
  ];
  return (
    <div>
      <Navbar
        logo={logo}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#3F4F3B"
        buttonBgColor="#3F4F3B"
        buttonTextColor="#fff"
        ease="power3.out"
        theme="light"
      />
    </div>
  );
}

export default Landing;
