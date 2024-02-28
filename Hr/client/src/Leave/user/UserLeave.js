import React, { useState } from "react";
import SeeApplication from "./components/SeeApplication";
import LeaveApplicationForm from "./components/LeaveApplicationForm";
import { allFirstDiv } from "../../components/DesignStandardize";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";

const UserLeave = () => {
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  return (
    <>
      <Navbar />
      <div className={`${allFirstDiv} px-2`}>
        <PageTitle title="Leave Application" />
        <div className="md:pt-20 flex flex-col gap-3 pt-2">
          {/* Tabs */}
          <div
            role="tablist"
            className="tabs tabs-boxed text-[28px] font-Inter w-max mx-auto md:mx-0"
          >
            <a
              role="tab"
              className={`tab ${toggleState === 1 && "tab-active"}`}
              onClick={() => {
                changeTab(1);
              }}
            >
              Apply For Leave
            </a>
            <a
              role="tab"
              className={`tab ${toggleState === 2 && "tab-active"}`}
              onClick={() => {
                changeTab(2);
              }}
            >
              See Aplication
            </a>
          </div>

          {toggleState === 1 ? <LeaveApplicationForm /> : <SeeApplication isAdmin={0}/>}
        </div>

        <div className="h-20" />
      </div>
    </>
  );
};

export default UserLeave;
