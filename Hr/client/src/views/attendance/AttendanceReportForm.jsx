import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceReportForm = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  // Define validation schema
  const validationSchema = Yup.object({
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          startDate: values.startDate,
          endDate: values.endDate,
        };

        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/reportsum`;

        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `${localStorage.getItem("jwtToken")}`,
          },
        });

        // Assuming you have a state variable named `setAttendanceData` to update the data
        // If not, replace it with the appropriate state update function
        setAttendanceData(response.data.report);

        // Display a success message using toast
        toast.success("Attendance report fetched successfully!");
        console.log(response.data);
      } catch (error) {
        // Display an error message using toast
        console.error("Error fetching attendance report:", error.message);
        toast.error("Error fetching attendance report");
      }
    },
  });

  return (
    <div>
      <div className="section mt-2">
        <div className="section-title">
          <h2>Attendance Report</h2>
        </div>
        <div className="card">
          <div className="card-body">
            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
              {/* Start Date Input */}
              <div className="form-group basic">
                <div className="input-wrapper">
                  <label className="label" htmlFor="startDate">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.startDate}
                    placeholder="Enter Start Date"
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <div className="error-message">
                      {formik.errors.startDate}
                    </div>
                  )}
                </div>
              </div>

              {/* End Date Input */}
              <div className="form-group basic">
                <div className="input-wrapper">
                  <label className="label" htmlFor="endDate">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-outline-primary rounded shadowed me-1 mb-1"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Submitting..." : "Get Attendance"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {attendanceData && (
        <div className="section mt-2">
          <div className="section-title">Attendance Data</div>
          <div className="card">
            <div className="table-responsive">
              <table className="table">
                <thead>
                <tr className="sticky top-0 bg-white">
                    <th scope="col">Employee ID</th>
                    <th scope="col">Present Day</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.EmployeeID}</td>
                      <td>{item.LoginTimeCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReportForm;
