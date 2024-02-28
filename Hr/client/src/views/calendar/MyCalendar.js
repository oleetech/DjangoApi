import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import {
  allFirstDiv,
  hoverScale,
  modalButton,
} from "../../components/DesignStandardize";
import GetToDoListDateUser from "../TodoList/employee/GetToDoListDateUser";
import AnnouncementCalendar from "./components/AnnouncementCalendar";
import TodoCalenderUser from "./components/TodoCalenderUser";
import GetToDoListDateAdmin from "../TodoList/admin/GetToDoListDateAdmin";
import TodoAdminCalender from "./components/TodoAdminCalender";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AddAnnounce from "./components/AddAnnounce";
import AddtodoAdmin from "../TodoList/admin/AddtodoAdmin";
import AddtodoUser from "../TodoList/employee/AddtodoUser";

const MyCalendar = () => {
  const [user, setUser] = useState(null);
  const userString = localStorage.getItem("user");
  const [toggleState, setToggleState] = useState(1);
  const isAdminLoggedIn = window.localStorage.getItem("adminloggedIn");
  const isUserLoggedIn = window.localStorage.getItem("user");
  const adminID = localStorage.getItem("adminID");

  const [showModal, setShowModal] = useState(false);
  const toggleAddModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const [showToDoModal, setShowToDoModal] = useState(false);
  const toggleAddToDoModal = () => {
    setShowToDoModal((prevShowModal) => !prevShowModal);
  };

  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, [userString]);

  return (
    <>
      <Navbar />

      <div className={`${allFirstDiv} px-2`}>
        <PageTitle title="Calendar" />
        <div
          className={`min-h-screen grid grid-cols-1 md:grid-cols-[1fr_300px] gap-1 pt-2 md:pt-20`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-row flex-wrap justify-between gap-3">
              <div role="tablist" className="tabs tabs-boxed h-max w-max">
                <a
                  role="tab"
                  className={`tab ${toggleState === 1 && "tab-active"}`}
                  onClick={() => {
                    changeTab(1);
                  }}
                >
                  Announcements
                </a>
                <a
                  role="tab"
                  className={`tab ${toggleState === 2 && "tab-active"}`}
                  onClick={() => {
                    changeTab(2);
                  }}
                >
                  Personal
                </a>
              </div>

              {isAdminLoggedIn !== null && isUserLoggedIn === null && (
                <div className="flex flex-row w-full justify-between gap-3 flex-wrap">
                  <div
                    className={`${modalButton} w-max h-max my-auto hover:cursor-pointer ${hoverScale}`}
                    onClick={toggleAddModal}
                  >
                    <AddIcon />
                    Add New Announcement
                  </div>
                  <div
                    className={`${modalButton} w-max h-max my-auto hover:cursor-pointer block md:hidden ${hoverScale}`}
                    onClick={toggleAddToDoModal}
                  >
                    <AddIcon />
                    Add To-Do
                  </div>
                </div>
              )}

              {isAdminLoggedIn === null && isUserLoggedIn !== null && (
                <div
                  className={`${modalButton} w-max h-max my-auto hover:cursor-pointer block md:hidden ${hoverScale}`}
                  onClick={toggleAddToDoModal}
                >
                  <AddIcon />
                  Add To-Do
                </div>
              )}
            </div>

            {toggleState === 1 ? (
              <AnnouncementCalendar />
            ) : (
              <>
                {isAdminLoggedIn === null && isUserLoggedIn !== null && (
                  <TodoCalenderUser />
                )}
                {isAdminLoggedIn !== null && isUserLoggedIn === null && (
                  <TodoAdminCalender />
                )}
              </>
            )}
          </div>

          {/* Show to do and announcements */}
          <div className="md:h-screen md:fixed right-0 top-20 bottom-0 md:border-l-2 border-solid pl-2">
            {user && isAdminLoggedIn === null && isUserLoggedIn !== null && (
              <GetToDoListDateUser
                id={user.employeeID}
                myCalendar={true}
                isAdmin={false}
              />
            )}

            {adminID && isAdminLoggedIn !== null && isUserLoggedIn === null && (
              <GetToDoListDateAdmin id={adminID} myCalendar={true} />
            )}
          </div>
        </div>
      </div>

      {/* Add new announcement */}
      {showModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleAddModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add Announcement
              </h2>
              <CloseIcon
                onClick={toggleAddModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <AddAnnounce />
          </div>
        </div>
      )}

      {/* Add todo  */}
      {showToDoModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleAddToDoModal}
          />
          <div className="card bg-white z-30 p-4 modal-white flex flex-col gap-3 my-auto">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add To-Do
              </h2>
              <CloseIcon
                onClick={toggleAddToDoModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            {isAdminLoggedIn !== null && isUserLoggedIn === null && (
              <AddtodoAdmin id={adminID} />
            )}
            {isAdminLoggedIn === null && isUserLoggedIn !== null && (
              <AddtodoUser id={user.employeeID} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyCalendar;
