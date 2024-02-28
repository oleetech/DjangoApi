import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveStatus = () => {
  const [singleUser, setSingleUser] = useState("");
  const [user, setUser] = useState("");
  const userString = localStorage.getItem("user");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const maxLeaveSickDays = 9;
  const maxLeaveCasualDays = 7;
  const SickDue = maxLeaveSickDays - singleUser.SickLeaveLeft;
  const CasualDue = maxLeaveCasualDays - singleUser.CasualLeaveLeft;

  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      console.log("userObject:", userObject);
      setUser(userObject);
      console.log({ myuser: user });
    }
  }, [userString]);

  const getLeaveInfo = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `${apiUrl}/employee/${user.employeeID}`
        );
        console.log(response.data.employeeInfo);
        setSingleUser(response.data.employeeInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getLeaveInfo();
    }
  }, [user ? user.employeeID : ""]);

  return (
    <div className="flex-1 p-4">
      <h2 className="text-2xl font-semibold">Leave Status</h2>

      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="min-w-full py-2 sm:px-6 lg:px-8 flex flex-col">
            <div>
              <p className="text-center font-semibold text-lg">Casual Leave</p>
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b dark:border-neutral-500 text-center">
                  <tr>
                    <th>Total</th>
                    <th>Taken</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold text-center border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                    <td className="p-2 bg-blue-200 hover:bg-blue-400">
                      {maxLeaveCasualDays}
                    </td>
                    <td className="p-2 bg-red-200 hover:bg-red-400">
                      {CasualDue}
                    </td>
                    <td className="p-2 bg-green-200 hover:bg-emerald-500">
                      {/* {due > 0 ? due : "No due left"} */}
                      {singleUser.CasualLeaveLeft}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="divider m-0" />
            <div>
              <p className="text-center font-semibold text-lg">Sick Leave</p>
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b dark:border-neutral-500 text-center">
                  <tr>
                    <th>Total</th>
                    <th>Taken</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold text-center border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                    <td className="p-2 bg-blue-200 hover:bg-blue-400">
                      {maxLeaveSickDays}
                    </td>
                    <td className="p-2 bg-red-200 hover:bg-red-400">
                      {SickDue}
                    </td>
                    <td className="p-2 bg-green-200 hover:bg-emerald-500">
                      {/* {due > 0 ? due : "No due left"} */}
                      {singleUser.SickLeaveLeft}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatus;
