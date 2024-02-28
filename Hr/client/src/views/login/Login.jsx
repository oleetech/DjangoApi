import React, { useState } from "react";
import welcome_dTech from "../../assets/images/welcome_dTech.png";
import buildings_icon from "../../assets/images/buildings_icon.png";
import sitelogo from "../../assets/images/logoSmall.png";
import airplane from "../../assets/images/flyImages.png";
import AdminLogin from "./components/AdminLogin";
import EmployeeLogin from "./components/EmployeeLogin";
const Login = () => {
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };

  return (
    <>
      <div className="h-screen flex flex-col gap-6 items-center justify-center">
        <img src={sitelogo} alt="DTech Corp. LTD" className="h-[100px] mb-5" />
        {/* Tabs */}
        <div role="tablist" className="tabs tabs-lifted text-[28px]">
          <a
            role="tab"
            className={`tab ${toggleState === 1 && "tab-active"}`}
            onClick={() => {
              changeTab(1);
            }}
          >
            Admin
          </a>
          <a
            role="tab"
            className={`tab ${toggleState === 2 && "tab-active"}`}
            onClick={() => {
              changeTab(2);
            }}
          >
            Employee
          </a>
        </div>

        {toggleState === 1 ? <AdminLogin /> : <EmployeeLogin />}
      </div>
    </>
  );
};

export default Login;

{
  /* <div class="hidden md:block my-auto ml-auto">
          <img
            src={welcome_dTech}
            alt="Welcme to DTech Corp."
            class="w-[500px] h-full rounded-2xl"
          />
        </div> 
        <div className="flex flex-row ">
            <img
              src={airplane}
              alt="airplane"
              className="ml-auto w-[200px] h-[50px]"
            />
          </div>
          <img
              src={buildings_icon}
              alt="Buildings"
              className="h-[80px] w-[100px]"
            />*/
}
