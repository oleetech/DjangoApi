import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import SeeIcon from "@mui/icons-material/Visibility";
import { borderStyle, hoverScale } from "../../../components/DesignStandardize";

const SeeAttendance = ({ idProp }) => {
  const [attendances, setAttendances] = useState([]);
  // Separate validation schema
  const validationSchema = Yup.object({
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
  });
  const formik = useFormik({
    initialValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/attendancebyid/${idProp}`;
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(apiUrl, values, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setAttendances(response.data.attendanceData || []);
        console.log("Attendance data fetched successfully:", attendances);
      } catch (error) {
        console.log("Error fetching attendance data:", error.response || error);
      }
    },
  });
  const [totalLate, setTotalLate] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  // ... (Previous code)

  const calculateTotalLate = () => {
    let totalLateMinutes = 0;
    let lateEntriesCount = 0;

    attendances.forEach((entry) => {
      if (entry.Late) {
        // Assuming entry.Late is in minutes, adjust as needed
        totalLateMinutes += parseInt(entry.Late, 10);

        // Increment the count if Late is equal to 1
        if (parseInt(entry.Late, 10) === 1) {
          lateEntriesCount += 1;
        }
      }
    });

    // You can convert the totalLateMinutes to hours and minutes if needed
    const totalLateHours = Math.floor(totalLateMinutes / 60);
    const remainingLateMinutes = totalLateMinutes % 60;

    setTotalLate(`${totalLateHours} hours ${remainingLateMinutes} minutes`);
    setLateCount(lateEntriesCount);
  };

  useEffect(() => {
    calculateTotalLate();
  }, [attendances]);
  return (
    <div className="flex flex-col gap-3">
      <p className="mt-1 z-0">See your attendance here...</p>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 z-0">
        <div className="flex gap-2">
          <label className="w-20 my-auto font-Inter">Start Date</label>
          <input
            type="date"
            id="startDate"
            className={`py-[2px] px-2 rounded-lg ${
              formik.touched.startDate && formik.errors.startDate
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.startDate}
            onChange={formik.handleChange}
          />
        </div>

        <div className="flex gap-2">
          <label className="w-20 my-auto" htmlFor="endDate">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className={`py-[2px] px-2 rounded-lg ${
              formik.touched.endDate && formik.errors.endDate
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.endDate}
            onChange={formik.handleChange}
          />
        </div>
        <button
          type="submit"
          className={`mr-auto p-1 text-white border rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
        >
          <SeeIcon fontSize="1px" /> Get Attendance
        </button>
      </form>

      {lateCount > 0 && (
        <p className="mt-3">
          Total Late: {lateCount}{" "}
          {lateCount > 1 ? <span>days</span> : <span>day</span>}
        </p>
      )}

      <div
        className={`max-h-96 max-w-96 sm:max-w-full overflow-auto mt-3 z-0  ${borderStyle}`}
      >
        <table className="table text-center overflow-x-auto">
          <thead>
            <tr className="md:sticky md:top-0 bg-white">
              <th>Date</th>
              <th>LogIn Time</th>
              <th>LogOut Time</th>
              <th>Location</th>
              <th>Late</th>
              <th>Leave</th>
            </tr>
          </thead>
          <tbody>
            {attendances &&
              attendances.map((entry, index) => (
                <tr key={index}>
                  <td className="border-r-2 border-solid border-base-200">
                    {entry.Date && entry.Date}
                  </td>
                  <td className="border-r-2 border-solid border-base-200">
                    {entry.LoginTime && entry.LoginTime}
                  </td>
                  <td className="border-r-2 border-solid border-base-200">
                    {entry.LogoutTime && entry.LogoutTime}
                  </td>
                  <td className="border-r-2 border-solid border-base-200">
                    {entry.locationName && entry.locationName}
                  </td>
                  <td className="border-r-2 border-solid border-base-200">
                    {entry.Late && entry.Late === 1 ? (
                      <p>Late</p>
                    ) : (
                      <p>On time</p>
                    )}
                  </td>
                  <td>{entry.Leave && entry.Leave}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeeAttendance;
