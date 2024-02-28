import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { allFirstDiv } from "../../components/DesignStandardize";
import PageTitle from "../../components/PageTitle";
import EmployeeList from "./componentsAD/EmployeeList";
import GetToDoListDateAdmin from "../TodoList/admin/GetToDoListDateAdmin";
import AttendanceList from "../attendance/AttendanceListComponents/AttendanceList";
import TaskList from "../attendance/AttendanceListComponents/TaskList";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const adminString = localStorage.getItem("admin");
  const adminID = localStorage.getItem("adminID");
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  useEffect(() => {
    if (adminString) {
      const adminObject = JSON.parse(adminString);
      setAdmin(adminObject);
    }
  }, [adminString]);
  return (
    <>
      <Navbar />

      <div className={`${allFirstDiv} md:px-2`}>
        <PageTitle title="Dashboard" />

        <div
          className={`min-h-screen grid grid-cols-1 md:grid-cols-[1fr_300px] gap-1 pt-2 md:pt-20`}
        >
          <div className="pb-10 flex flex-col gap-3  md:border-r-2 border-solid pr-2">
            <div
              role="tablist"
              className="tabs tabs-boxed text-[28px] font-Inter w-max mx-auto"
            >
              <a
                role="tab"
                className={`tab ${toggleState === 1 && "tab-active"}`}
                onClick={() => {
                  changeTab(1);
                }}
              >
                Employees
              </a>
              <a
                role="tab"
                className={`tab ${toggleState === 2 && "tab-active"}`}
                onClick={() => {
                  changeTab(2);
                }}
              >
                Attendance
              </a>
              <a
                role="tab"
                className={`tab ${toggleState === 3 && "tab-active"}`}
                onClick={() => {
                  changeTab(3);
                }}
              >
                Task
              </a>
            </div>
            {toggleState === 1 && <EmployeeList />}
            {toggleState === 2 && <AttendanceList />}
            {toggleState === 3 && <TaskList />}
          </div>

          {adminID && (
            <div className="hidden md:block md:h-screen right-0 top-20 bottom-0">
              <GetToDoListDateAdmin id={adminID} myCalendar={false} />
              <div className="h-20" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
