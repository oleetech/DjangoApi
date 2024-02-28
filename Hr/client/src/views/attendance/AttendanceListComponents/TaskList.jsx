import React, { useState, useEffect } from "react";
import axios from "axios";
import { generalEditInputUser } from "../../../components/DesignStandardize";

const TaskList = () => {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState(null);
  const uniqueNames = new Set();
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDate(newDate);

    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/allToday/${newDate}`; // Use the newDate directly
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

  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-3 text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
        View All Employee Tasks
      </h2>
      <div className="flex gap-2 w-80">
        <label className="w-36 my-auto">Select Date:</label>
        <input
          type="date"
          id="datePicker"
          className={`${generalEditInputUser}`}
          value={date}
          onChange={handleDateChange} // Use the new handler for date change
        />
      </div>
      <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto">
        <table className="table text-center overflow-x-auto">
          <thead>
            <tr className="sticky top-0 bg-white">
              <th>Employee Name</th>
              <th>
                10:15 a.m <br />
                to <br /> 12:15 p.m
              </th>
              <th>
                12:15 p.m <br />
                to <br /> 2:15 p.m
              </th>
              <th>
                2:15 p.m <br /> to <br /> 4:15 p.m
              </th>
              <th>
                4:15 p.m <br /> to <br /> 6:15 p.m
              </th>
              <th>Late Task</th>
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
                      <td className="w-[173px] h-[64px]">
                        {entry.EmployeeInfo.Name && entry.EmployeeInfo.Name}
                      </td>
                      <td className="w-[173px] h-[64px]">
                        {entry.Daily_Task1 && entry.Daily_Task1}
                      </td>
                      <td className="w-[173px] h-[64px]">
                        {entry.Daily_Task2 && entry.Daily_Task2}
                      </td>
                      <td className="w-[173px] h-[64px]">
                        {entry.Daily_Task3 && entry.Daily_Task3}
                      </td>
                      <td className="w-[173px] h-[64px]">
                        {entry.Daily_Task4 && entry.Daily_Task4}
                      </td>
                      <td className="w-[173px] h-[64px]">
                        {entry.Late_Task && entry.Late_Task}
                      </td>
                    </tr>
                  );
                }

                // If the name is already in the Set, skip rendering this row
                return null;
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
