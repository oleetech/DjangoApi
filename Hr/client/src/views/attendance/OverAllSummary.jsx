import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { allFirstDiv, pageTitle } from "../../components/DesignStandardize";

function OverAllSummary() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [task, setTask] = useState(null);

  const getattendance = async () => {
    try {
      // Check if user is available before making the API call

      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/${user.employeeID}`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setAttendance(response.data.attendances);
      console.log(response.data.attendances);
    } catch (error) {
      console.log("Error fetching attendance:", error);
      // You might want to update state or display an error message to the user
    }
  };

  const gettask = async () => {
    try {
      // Check if user is available before making the API call

      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/employeeTask/${user.employeeID}`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setTask(response.data.attendances);
      console.log(response.data.attendances);
    } catch (error) {
      console.log("Error fetching attendance:", error);
      // You might want to update state or display an error message to the user
    }
  };

  // স্টেপ 3 : User Info
  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ব্যবহারকারীর তথ্য প্রাপ্ত করুন
    const userString = localStorage.getItem("user");
    if (userString) {
      // JSON স্ট্রিং পার্স করে ব্যবহারকারী অবজেক্ট প্রাপ্ত করুন
      const userObject = JSON.parse(userString);
      console.log("userObject:", userObject);

      // ব্যবহারকারী স্টেট সেট করুন
      setUser(userObject);
    }
  }, []); // এই ইফেক্টটি শুধুমাত্র মাউন্ট হতে একবার চলবে

  // Call getattendance after setting the user
  useEffect(() => {
    if (user) {
      getattendance();
      gettask();
    }
  }, [user]);

  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  return (
    <>
      <Navbar />
      <div className={`${allFirstDiv} font-Inter`}>
        <div className="flex flex-col p-2 md:p-16 gap-6">
          <p className={`${pageTitle}`}>Overall Summary</p>

          <p className="">
            Get an Overview of your Attendance Report and Daily Tasks
          </p>

          {/* Tabs */}
          <div
            role="tablist"
            className="tabs tabs-bordered text-[28px] font-Inter w-max"
          >
            <a
              role="tab"
              className={`tab ${toggleState === 1 && "tab-active"}`}
              onClick={() => {
                changeTab(1);
              }}
            >
              Attendance Report
            </a>
            <a
              role="tab"
              className={`tab ${toggleState === 2 && "tab-active"}`}
              onClick={() => {
                changeTab(2);
              }}
            >
              Daily Tasks Summary
            </a>
          </div>

          <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto">
            <table className="table text-center overflow-x-auto">
              <thead>
                {toggleState === "1" ? (
                  <tr className="sticky top-0 bg-white">
                    <th>Check-in Time</th>
                    <th>Location</th>
                    <th>Check-out Time</th>
                    <th>Location</th>
                  </tr>
                ) : (
                  <tr className="sticky top-0 bg-white">
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Designation</th>
                    <th>CheckIn</th>
                    <th>CheckOut</th>
                    <th>Location</th>
                    <th className="text-center">
                      10:15 a.m <br />
                      to <br /> 12:15 p.m
                    </th>
                    <th className="text-center">
                      12:15 p.m <br />
                      to <br /> 2:15 p.m
                    </th>
                    <th className="text-center">
                      2:15 p.m <br /> to <br /> 4:15 p.m
                    </th>
                    <th className="text-center">
                      4:15 p.m <br /> to <br /> 6:15 p.m
                    </th>
                    <th> Late Task</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {toggleState === "1" ? (
                  <>
                    {attendance &&
                      attendance.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.LoginTime && entry.LoginTime}</td>
                          <td>{entry.locationName && entry.locationName}</td>
                          <td>{entry.LogoutTime && entry.LogoutTime}</td>
                          <td>{entry.locationName && entry.locationName}</td>
                        </tr>
                      ))}
                  </>
                ) : (
                  <>
                    {task &&
                      task.map((entry, index) => (
                        <tr key={index}>
                          {/* Render Name for each record */}
                          <td>{entry.EmployeeInfo.Name}</td>
                          <td>{entry.Date && entry.Date}</td>
                          <td>
                            {entry.EmployeeInfo.Designation &&
                              entry.EmployeeInfo.Designation}
                          </td>
                          <td>{entry.LoginTime && entry.LoginTime}</td>
                          <td>{entry.LoginTime && entry.LogoutTime}</td>

                          <td>{entry.locationName && entry.locationName}</td>

                          {/* Conditionally render other fields only for the first entry with the same date */}
                          {index === 0 ||
                          entry.Date !== task[index - 1].Date ? (
                            <>
                              <td>{entry.Daily_Task1 && entry.Daily_Task1}</td>
                              <td>{entry.Daily_Task2 && entry.Daily_Task2}</td>
                              <td>{entry.Daily_Task3 && entry.Daily_Task3}</td>
                              <td>{entry.Daily_Task4 && entry.Daily_Task4}</td>
                              <td>{entry.Late_Task && entry.Late_Task}</td>
                            </>
                          ) : (
                            // Render empty cells for other rows with the same date
                            <>
                              {/* <td className='w-[173px] h-[64px]'></td>
            <td className='w-[173px] h-[64px]'></td>
            <td className='w-[173px] h-[64px]'></td>
            <td className='w-[173px] h-[64px]'></td>
            <td className='w-[173px] h-[64px]'></td> */}
                            </>
                          )}
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverAllSummary;
