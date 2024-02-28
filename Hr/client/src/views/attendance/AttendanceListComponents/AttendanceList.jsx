import React, { useState } from "react";
import axios from "axios";
import { generalEditInputUser } from "../../../components/DesignStandardize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignIn,
  faSignOut,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";

const AttendanceList = () => {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState(null);

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/allToday/${newDate}`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setAttendance(response.data.attendances);
    } catch (error) {
      console.log("Error fetching attendance:", error);
      setAttendance(null);
      // You might want to update state or display an error message to the user
    }
  };

  const redirectToLocation = (latitude, longitude) => {
    const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapURL, "_blank");
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-3 text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
        View All Employee Attendance
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

      <div className="mt-3 max-h-96 max-w-96 sm:max-w-full overflow-auto">
        <table className="min-w-full text-center text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-700">
            <tr className="sticky top-0 bg-white">
              <th className="pb-2">Employee Name</th>
              <th className="pb-2">
                Login Time <FontAwesomeIcon icon={faSignIn} className="pl-2" />
              </th>
              <th className="pb-2">
                LogOut Time{" "}
                <FontAwesomeIcon icon={faSignOut} className="pl-2" />
              </th>
              <th className="pb-2">
                Location{" "}
                <FontAwesomeIcon
                  icon={faMagnifyingGlassLocation}
                  className="pl-2"
                />
              </th>
              <th className="pb-2">Late</th>
              <th className="pb-2">Leave</th>
            </tr>
          </thead>
          <tbody>
            {attendance &&
              attendance.map((entry, index) => (
                <tr key={index}>
                  <td className="w-[173px] h-[64px]">
                    {entry.EmployeeInfo.Name && entry.EmployeeInfo.Name}
                  </td>
                  <td className="w-[173px] h-[64px]">{entry.LoginTime}</td>
                  <td className="w-[173px] h-[64px]">{entry.LogoutTime}</td>
                  <td
                    className="w-[173px] h-[64px] hover:cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      redirectToLocation(entry.Latitude, entry.Longitude)
                    }
                  >
                    {entry.locationName && entry.locationName}
                  </td>
                  <td className="w-[173px] h-[64px]">
                    {entry.Late && entry.Late === 0 ? "On-time" : "Late"}
                  </td>
                  <td className="w-[173px] h-[64px]">
                    {entry.Leave && entry.Leave === false
                      ? "On-Leave"
                      : "Woking"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
