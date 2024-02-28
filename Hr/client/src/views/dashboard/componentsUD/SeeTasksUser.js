import React, { useEffect, useState } from "react";
import axios from "axios";

const SeeTasksUser = () => {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [task, setTask] = useState(null);
  const [date, setDate] = useState("");
  const uniqueNames = new Set();
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

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDate(newDate);

    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/allTodayUser/${user.employeeID}/${newDate}`;
      const token = localStorage.getItem("jwtToken");

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setAttendance(response.data.attendance);
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getattendance();
      gettask();
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-3">
      <p className="mt-1 z-0">See your task here...</p>
      <div className="flex gap-2">
        <label className="my-auto">Select Date:</label>
        <input
          type="date"
          id="datePicker"
          className="py-1 px-4 rounded-lg"
          value={date}
          onChange={handleDateChange} // Use the new handler for date change
        />
      </div>

      <table className="table text-center overflow-x-auto">
        <thead>
          <tr className="sticky top-0 bg-white">
            <th scope="col">
              10:15 a.m <br />
              to <br /> 12:15 p.m
            </th>
            <th scope="col">
              12:15 p.m <br />
              to <br /> 2:15 p.m
            </th>
            <th scope="col">
              2:15 p.m <br /> to <br /> 4:15 p.m
            </th>
            <th scope="col">
              {" "}
              4:15 p.m <br /> to <br /> 6:15 p.m
            </th>
            <th scope="col"> Late Task</th>
          </tr>
        </thead>
        <tbody>
          {attendance &&
            attendance.map((entry, index) => {
              // Check if the name is already added to the Set
              if (!uniqueNames.has(entry.EmployeeInfo.Name)) {
                // If not, add the name to the Set and render the row
                uniqueNames.add(entry.EmployeeInfo.Name);

                return (
                  <tr key={index}>
                    <td className="w-[173px] h-[64px]">{entry.Daily_Task1}</td>
                    <td className="w-[173px] h-[64px]">{entry.Daily_Task2}</td>
                    <td className="w-[173px] h-[64px]">{entry.Daily_Task3}</td>
                    <td className="w-[173px] h-[64px]">{entry.Daily_Task4}</td>
                    <td className="w-[173px] h-[64px]">{entry.Late_Task}</td>
                  </tr>
                );
              }

              // If the name is already in the Set, skip rendering this row
              return null;
            })}
        </tbody>
      </table>
    </div>
  );
};

export default SeeTasksUser;
