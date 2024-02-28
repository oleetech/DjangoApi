import React from "react";
import { Link } from "react-router-dom";
import sitelogo from "../../src/assets/images/logoSmall.png";

const Header = () => {
  return (
    <>
      {/* App Header */}
      <div className="appHeader bg-white text-light">
        <div className="left">
          <Link
            to="#"
            className="headerButton"
            data-bs-toggle="modal"
            data-bs-target="#sidebarPanel"
          >
            <i className="fa fa-bars text-black" aria-hidden="true"></i>
          </Link>
        </div>
        <div className="pageTitle">
          <h1 className="">Dtech</h1>
          {/* <img src={sitelogo} alt="Site Logo" className="logo" /> */}
        </div>
        <div className="right">
          <Link to="" className="headerButton"></Link>
        </div>
      </div>
      {/* * App Header */}
    </>
  );
};

export default Header;
