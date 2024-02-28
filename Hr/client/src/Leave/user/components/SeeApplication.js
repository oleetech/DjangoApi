import React from "react";
import { useState, useEffect } from "react";
import UserPendingInfo from "./UserPendingInfo";
import UserApprovedInfo from "./UserApprovedInfo";
import UserDisApprovedInfo from "./UserDisApprovedInfo";

const SeeApplication = ({idProps, isAdmin}) => {
  const [tab, setTab] = useState("option1");
  const [user, setUser] = useState("");
  const userString = localStorage.getItem("user");
  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      console.log("userObject:", userObject);
      setUser(userObject);
      console.log({ myuser: user });
    }
    console.log("user info:", user);
  }, [userString]);
  const handleValueChange = (event) => {
    setTab(event.target.value);
  };
  return (
    <>
      <select
        value={tab}
        onChange={handleValueChange}
        className="select select-info w-[260px]"
      >
        <option value="option1">Pending</option>
        <option value="option2">Approved</option>
        <option value="option3">Disapproved</option>
      </select>

      {tab === "option1" && <UserPendingInfo id={user.employeeID || idProps} isAdmin={isAdmin}/>}
      {tab === "option2" && (
        <UserApprovedInfo id={user.employeeID || idProps}/>
      )}
      {tab === "option3" && (
        <UserDisApprovedInfo id={user.employeeID || idProps} />
      )}
    </>
  );
};

export default SeeApplication;
