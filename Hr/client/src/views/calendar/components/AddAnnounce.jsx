import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  generalInput,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";

const AddAnnounce = () => {
  const apiurl = process.env.REACT_APP_API_BASE_URL;
  const formik = useFormik({
    initialValues: {
      Title: "",
      Description: "",
      Date: "",
      Month: "",
      Year: "",
      Status: "Active",
    },
    validationSchema: Yup.object({
      Title: Yup.string().required("Title is required"),
      Description: Yup.string().required("Description is required"),
      Date: Yup.date().required("Date is required"),
      // Add more validations as needed
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Set Month and Year from Date
        const dateObj = new Date(values.Date);
        values.Month = dateObj.toLocaleString("en-US", { month: "long" });
        values.Year = dateObj.getFullYear();

        // Make API request
        const response = await axios.post(
          `${apiurl}/announcement/create`,
          values
        );

        console.log("API Response:", response.data);
        toast.success("Announce saved successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Announce Save ERROR", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Title */}
        <div>
          <label>Title</label>
          <input
            type="text"
            name="Title"
            onChange={formik.handleChange}
            value={formik.values.Title}
            className={`${generalInput}`}
          />
          {formik.touched.Title && formik.errors.Title && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.Title}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label>Date</label>
          <input
            type="date"
            name="Date"
            onChange={formik.handleChange}
            value={formik.values.Date}
            className={`${generalInput}`}
            min={getCurrentDate()}
          />
          {formik.touched.Date && formik.errors.Date && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.Date}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            name="Description"
            onChange={formik.handleChange}
            value={formik.values.Description}
            className={`${generalInput}`}
          />
          {formik.touched.Description && formik.errors.Description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.Description}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label>Status</label>
          <select
            name="Status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Status}
            className={`${generalInput}`}
          >
            <option value="Active">Due</option>
            <option value="Inactive">Completed</option>
          </select>
          {formik.touched.Status && formik.errors.Status && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.Status}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className={`mr-auto ${modalButton} ${hoverScale}`}>
        Submit
      </button>
    </form>
  );
};

export default AddAnnounce;
