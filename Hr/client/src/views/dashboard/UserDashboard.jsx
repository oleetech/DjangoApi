import React, { useEffect, useState } from "react";
import GiveAttendance from "../attendance/GiveAttendance";
import GetToDoListDate from "../TodoList/employee/GetToDoListDateUser";
import Navbar from "../../components/Navbar";
import { allFirstDiv } from "../../components/DesignStandardize";
import PageTitle from "../../components/PageTitle";
import CollapsibleContent from "../../components/CollapsibleContent";
import AddDailyTask from "./componentsUD/AddDailyTask";
import SeeDailyTask from "./componentsUD/SeeDailyTask";
import SeeProjects from "./componentsUD/SeeProjects";
import SeeAttendance from "./componentsUD/SeeAttendance";
import LeaveStatus from "../../Leave/user/components/LeaveStatus";
import SeeTasksUser from "./componentsUD/SeeTasksUser";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const userString = localStorage.getItem("user");
  const ispresent = localStorage.getItem("ispresent");
  console.log(ispresent);
  // Convert the string "true" to a boolean
const isPresentBoolean = ispresent === "true";


  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, [userString]);

  const [openSection, setOpenSection] = useState(null);

  const handleToggle = (index) => {
    setOpenSection((prevIndex) => (prevIndex === index ? null : index));
  };

    // Helper function to parse JWT token
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };


  const checkTokenExpiration = () => {
    const token = localStorage.getItem("jwtToken");
  
    if (token) {
      const decodedToken = parseJwt(token);
  
      // Check if token is expired
      const expirationTime = 8 * 60 * 60; // 8 hours in seconds
      if (decodedToken.exp < Date.now() / 1000 + expirationTime) {
        // Clear expired token
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
  
        toast.error("Token has expired. Redirecting to home page.", {
          position: toast.POSITION.TOP_RIGHT,
        });
  
        // Redirect to home page
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    // Check token expiration on app load
    checkTokenExpiration();
  }, []);

  return (
    <>
      <Navbar />

      <div className={`${allFirstDiv} md:px-2`}>
        <PageTitle title="Dashboard" />
        <div
          className={`min-h-screen grid grid-cols-1 md:grid-cols-[1fr_300px] gap-1 md:pt-20`}
        >
          <div className="pr-1 pb-10 flex flex-col gap-3">
            {/* Attendence and leave record */}
            <div className="flex flex-col lg:flex-row lg:flex-wrap">
              <GiveAttendance />
              <div className="bg-blue-50 min-w-60 flex-grow lg:mx-2">
                <LeaveStatus />
              </div>
            </div>

            {/* Add daily task */}
                    <div>
            {isPresentBoolean && (
              <CollapsibleContent
                title="Add Daily Task"
                onToggle={() => handleToggle(0)}
                isOpen={openSection === 0}
                noStatus={true}
              >
                <AddDailyTask />
              </CollapsibleContent>
            )}
            {/* Add other components or code here if needed */}
          </div>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* See daily task */}
              <CollapsibleContent
                title="See Tasks"
                onToggle={() => handleToggle(1)}
                isOpen={openSection === 1}
              >
                <SeeTasksUser />
              </CollapsibleContent>

              {/* See projects */}
              <CollapsibleContent
                title="See Projects"
                onToggle={() => handleToggle(2)}
                isOpen={openSection === 2}
              >
                {user && (
                  <SeeProjects idProp={user.employeeID} isAdmin={false} />
                )}
              </CollapsibleContent>

              {/* See Attendance */}
              <CollapsibleContent
                title="See Attendance"
                onToggle={() => handleToggle(3)}
                isOpen={openSection === 3}
              >
                {user && <SeeAttendance idProp={user.employeeID} />}
              </CollapsibleContent>
            </div>
          </div>

          {user && (
            <div className="hidden md:block md:h-screen right-0 md:fixed md:border-l-2 border-solid pl-2">
              <GetToDoListDate
                id={user.employeeID}
                myCalendar={false}
                isAdmin={false}
              />
              <div className="h-20" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
