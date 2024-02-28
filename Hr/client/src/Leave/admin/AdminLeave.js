import React from "react";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { allFirstDiv } from "../../components/DesignStandardize";
import PendingInfo from "./components/PendingInfo";
import ApprovedInfo from "./components/ApprovedInfo";
import DisapprovedInfo from "./components/DisapprovedInfo";
import PageTitle from "../../components/PageTitle";

const AdminLeave = () => {
  const [tab, setTab] = useState("option1");

  const handleValueChange = (event) => {
    setTab(event.target.value);
  };
  return (
    <>
      <Navbar />
      <div className={`${allFirstDiv} px-2`}>
        <PageTitle title="Leave Applications" />

        <div className={`min-h-screen flex flex-col gap-3 pt-2 md:pt-20`}>
          <select
            value={tab}
            onChange={handleValueChange}
            className="select select-info w-[260px]"
          >
            <option value="option1">Pending</option>
            <option value="option2">Approved</option>
            <option value="option3">Disapproved</option>
          </select>

          {tab === "option1" && <PendingInfo />}
          {tab === "option2" && <ApprovedInfo />}
          {tab === "option3" && <DisapprovedInfo />}
        </div>
      </div>
    </>
  );
};

export default AdminLeave;
