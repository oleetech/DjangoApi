import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HamburgerButton from "./Hamburger";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Speed";
import LogoutIcon from "@mui/icons-material/Logout";
import ToDoListIcon from "@mui/icons-material/ListAlt";
import LeaveApplicationIcon from "@mui/icons-material/InsertInvitation";
import EmployeeDetails from "./EmployeeDetails";
import logo from "../assets/images/logo.png";
import { hoverScale } from "./DesignStandardize";
import "./Navbar.css";
import AdminDetails from "./AdminDetails";

const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(false);

  const isAdminLoggedIn = window.localStorage.getItem("adminloggedIn");
  const isUserLoggedIn = window.localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    if (isUserLoggedIn) {
      localStorage.removeItem("user");
    } else if (isAdminLoggedIn) {
      localStorage.removeItem("adminloggedIn");
    }
    window.location.href = "/";
  };

  const userPanel = [
    {
      name: "Dashboard",
      path: "/employee/dashboard",
      Icons: <DashboardIcon />,
    },
    {
      name: "Calendar",
      path: "/employee/calendar",
      Icons: <CalendarMonthIcon />,
    },
    {
      name: "Leave Application",
      path: "/employee/leave-application",
      Icons: <LeaveApplicationIcon />,
    },
  ];

  const adminPanel = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      Icons: <DashboardIcon />,
    },
    {
      name: "Calendar",
      path: "/admin/calendar",
      Icons: <CalendarMonthIcon />,
    },
    {
      name: "Leave Application",
      path: "/admin/leave-application",
      Icons: <LeaveApplicationIcon />,
    },
  ];

  const handleClick = () => {
    setActive(false);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-Inter ">
      <div>
        <div className="px-2 flex md:flex-col justify-between md:px-2 md:py-5 bg-blue-50 text-white shadow-md border-b-2 w-full md:w-16 md:h-screen h-14 md:fixed md:left-0">
          <div className="font-Inter md:text-center flex flex-col gap-6 items-center">
            {isAdminLoggedIn !== null && isUserLoggedIn === null && (
              <Link to="/admin/dashboard">
                <img
                  src={logo}
                  alt="Welcme to DTech Corp."
                  class="my-auto w-20"
                />
              </Link>
            )}

            {isAdminLoggedIn === null && isUserLoggedIn !== null && (
              <Link to="/admin/dashboard">
                <img
                  src={logo}
                  alt="Welcme to DTech Corp."
                  class="my-auto w-20"
                />
              </Link>
            )}
            {/* Navbar md-lg screen */}

            <ul className="hidden md:flex flex-col text-left gap-3 m-0 p-0 w-max">
              {isAdminLoggedIn !== null &&
                isUserLoggedIn === null &&
                adminPanel.map((el, i) => (
                  <li
                    key={i}
                    className={`text-lg lg:text-xl w-max p-1 rounded-lg text-black ${
                      location.pathname === el.path
                        ? "bg-[#414141] border-b-2 border-[#181818] text-white shadow-md"
                        : `hover:bg-[#414141] hover:text-white cursor-pointer ${hoverScale}`
                    }`}
                  >
                    <Link
                      to={el.path}
                      onClick={handleClick}
                      className={`flex gap-2 items-center tooltip tooltip-right`}
                      data-tip={el.name}
                    >
                      {el.Icons}
                    </Link>
                  </li>
                ))}

              {isAdminLoggedIn === null &&
                isUserLoggedIn !== null &&
                userPanel.map((el, i) => (
                  <li
                    key={i}
                    className={`text-lg lg:text-xl w-max p-1 rounded-lg text-black ${
                      location.pathname === el.path
                        ? "bg-[#414141] border-b-2 border-[#181818] text-white shadow-md"
                        : `hover:bg-[#414141] hover:text-white cursor-pointer ${hoverScale}`
                    }`}
                  >
                    <Link
                      to={el.path}
                      onClick={handleClick}
                      className={`flex gap-2 items-center tooltip tooltip-right`}
                      data-tip={el.name}
                    >
                      {el.Icons}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* log out md-lg screen */}
          <Link
            className={`hidden md:block text-xl hover:font-semibold mx-auto text-red-500 hover:text-red-700 ${hoverScale}`}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </Link>

          {/* small screen */}
          <div className="my-auto ml-auto text-white md:hidden flex gap-3">
            <HamburgerButton
              active={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {isAdminLoggedIn === null && isUserLoggedIn !== null && (
              <EmployeeDetails />
            )}
            {isAdminLoggedIn !== null && isUserLoggedIn === null && (
              <AdminDetails />
            )}
          </div>
        </div>
      </div>

      {/* navbar items small screen */}
      <div
        className={`mobile-menu md:hidden flex flex-col gap-3 ${
          menuOpen ? "open" : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <ul className="m-0 p-0 flex flex-col gap-3 w-max items-center">
          {isAdminLoggedIn !== null &&
            isUserLoggedIn === null &&
            adminPanel.map((el, i) => (
              <li
                key={i}
                className={`text-lg lg:text-xl p-2 w-full text-black ${
                  location.pathname === el.path
                    ? "bg-[#414141] border-b-2 border-[#181818] text-white shadow-md"
                    : `hover:bg-[#414141] hover:text-white cursor-pointer ${hoverScale}`
                }`}
              >
                <Link
                  to={el.path}
                  onClick={handleClick}
                  className="flex gap-2 text-white items-center"
                >
                  {el.Icons}
                  {el.name}
                </Link>
              </li>
            ))}

          {isAdminLoggedIn === null &&
            isUserLoggedIn !== null &&
            userPanel.map((el, i) => (
              <li
                key={i}
                className={`text-lg lg:text-xl p-2 w-full text-black ${
                  location.pathname === el.path
                    ? "bg-[#414141] border-b-2 border-[#181818] text-white shadow-md"
                    : `hover:bg-[#414141] hover:text-white cursor-pointer ${hoverScale}`
                }`}
              >
                <Link
                  to={el.path}
                  onClick={handleClick}
                  className="flex gap-2 text-white items-center"
                >
                  {el.Icons}
                  {el.name}
                </Link>
              </li>
            ))}
        </ul>
        <Link
          className="text-xl hover:font-semibold mx-auto text-red-500 hover:text-red-500 pb-2"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
