import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../../components/Navbar";
import { allFirstDiv, pageTitle } from "../../components/DesignStandardize";

// Separate validation schema
const validationSchema = Yup.object({
  // employeeId: Yup.string().required('Employee ID is required'),
  startDate: Yup.date().required("Start Date is required"),
  endDate: Yup.date().required("End Date is required"),
});

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [user, setUser] = useState(null);
  // Initialize counts
  let presentCount = 0;
  let absentCount = 0;

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
      // Set employeeId in the formik values based on user's role
      formik.setValues({
        ...formik.values,
        employeeId: userObject.role === "employee" ? userObject.employeeId : "",
      });
    }
  }, []);

  const calculateHours = (loginTime, logoutTime) => {
    if (loginTime && logoutTime) {
      const login = new Date(`1970-01-01 ${loginTime}`);
      const logout = new Date(`1970-01-01 ${logoutTime}`);
      const hours = (logout - login) / (1000 * 60 * 60);
      return hours.toFixed(2); // Format to two decimal places
    }
    return "Not Available";
  };

  const isEmployee = user && user.role === "employee";

  const formik = useFormik({
    initialValues: {
      // employeeId: '',
      startDate: "",
      endDate: "",
    },
    validationSchema, // Use the separate validation schema
    onSubmit: async (values) => {
      try {
        const payload = {
          employeeId: values.employeeId,
          startDate: values.startDate,
          endDate: values.endDate,
        };

        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/report`;

        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `${localStorage.getItem("jwtToken")}`,
          },
        });

        setAttendanceData(response.data.attendanceData);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching attendance report:", error.message);
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className={`${allFirstDiv} px-2`}>
        <div className="flex flex-col p-2 md:p-16 gap-6">
          <h2 className={`${pageTitle}`}>Attendance Report</h2>
          <form
            className="font-Inter grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 justify-between"
            onSubmit={formik.handleSubmit}
          >
            {/* {!isEmployee && (
                    <div className="form-group basic">
                    <div className="input-wrapper">
                      <label className="label" htmlFor="employeeId">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="employeeId"
                        name="employeeId"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.employeeId}
                        placeholder="Enter Employee ID"
                      />
                      {formik.touched.employeeId && formik.errors.employeeId && (
                        <div className="error-message">{formik.errors.employeeId}</div>
                      )}
                    </div>
                  </div>
            )} */}

            <div className="w-80 flex flex-col gap-[1px]">
              <label>Start Date</label>
              <input
                type="date"
                className="border-2 boder-black py-1 px-2 rounded-md"
                id="startDate"
                name="startDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
                placeholder="Enter Start Date"
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <div className="error-message">{formik.errors.startDate}</div>
              )}
            </div>

            <div className="w-80 flex flex-col gap-[1px]">
              <label>End Date</label>
              <input
                type="date"
                className="border-2 boder-black py-1 px-2 rounded-md"
                id="endDate"
                name="endDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endDate}
                placeholder="Enter End Date"
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <div className="error-message">{formik.errors.endDate}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-max btn btn-outline-primary rounded shadowed me-1 mb-1 btn-xs bg-gradient-primary"
            >
              Get Attendance
            </button>
          </form>

          {attendanceData && (
            <div className="section mt-2">
              <div className="section-title">Attendance Data</div>
              <div className="card">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr className="sticky top-0 bg-white">
                        <th scope="col">Employee ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Date</th>
                        <th scope="col">Login Time</th>
                        <th scope="col">Logout Time</th>
                        <th scope="col">Daily_Task1 </th>
                        <th scope="col">Daily_Task2</th>
                        <th scope="col">Daily_Task3</th>
                        <th scope="col">Daily_Task4</th>
                        <th scope="col">Daily_Task5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((attendance) => {
                        const loginTime = attendance.LoginTime
                          ? new Date(attendance.LoginTime)
                          : null;
                        const logoutTime = attendance.LogoutTime
                          ? new Date(attendance.LogoutTime)
                          : null;

                        // Calculate time difference in hours
                        const timeDifference =
                          logoutTime && loginTime
                            ? (logoutTime - loginTime) / (1000 * 60 * 60)
                            : 0;

                        // Update counts
                        if (timeDifference > 7) {
                          presentCount += 1;
                        } else {
                          absentCount += 1;
                        }

                        return (
                          <tr key={attendance.AttendanceID}>
                            <td>{attendance.EmployeeID}</td>
                            <td>{attendance.EmployeeInfo.Name}</td>
                            <td>{attendance.EmployeeInfo.Designation}</td>
                            <td>{attendance.Date}</td>
                            <td>{attendance.LoginTime}</td>
                            <td>{attendance.LogoutTime || "Not Available"}</td>
                            <td>{attendance.Daily_Task1}</td>
                            <td>{attendance.Daily_Task2}</td>
                            <td>{attendance.Daily_Task3}</td>
                            <td>{attendance.Daily_Task4}</td>
                            <td>{attendance.Late_Task}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Display counts */}
          {/* <div className="section mt-2">
        <div className="section-title">Attendance Summary</div>
        <p>Total Present: {presentCount}</p>
        <p>Total Absent: {absentCount}</p>
      </div> */}
        </div>
      </div>
    </>
  );
};

export default AttendanceReport;
