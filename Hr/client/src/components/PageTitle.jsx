import React, { useEffect, useRef, useState } from "react";
import EmployeeDetails from "./EmployeeDetails";
import GetAnnouncementDate from "../views/dashboard/componentsUD/GetAnnouncementDate";
import Notification from "@mui/icons-material/NotificationsActive";
import AdminDetails from "./AdminDetails";

const PageTitle = ({ title }) => {
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef();
  const isAdminLoggedIn = window.localStorage.getItem("adminloggedIn");

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex justify-between p-2 md:px-4 text-black border-b-2 border-b-solid md:fixed top-0 right-0 left-16 z-10 bg-inherit">
      <p className="text-3xl m-0">{title}</p>

      <div className="flex gap-3">
        {/* Announcement */}
        <div ref={containerRef} style={{ position: "relative" }}>
          <Notification
            className="relative inline-block hover:cursor-pointer rounded-full w-8 h-8 mt-2 p-[1px] hover:bg-[#414141] hover:text-white"
            onClick={handleClick}
          />

          {isClicked && (
            <div
              className={`bg-base-200 p-2 rounded-lg absolute right-0 z-10 shadow-lg`}
            >
              <GetAnnouncementDate />
            </div>
          )}
        </div>
        {/* Session Menu */}
        <div className="hidden md:block mt-1">
          {isAdminLoggedIn === null && <EmployeeDetails />}
          {isAdminLoggedIn !== null && <AdminDetails />}
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
