import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";
import EyeIcon from "@mui/icons-material/Visibility";
import EyeCloseIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";

const EmployeeCreate = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const formik = useFormik({
    initialValues: {
      Name: "",
      Email: "",
      Contact: "",
      JoiningDate: "",
      BloodGroup: "",
      EmergencyContact: "",
      PrimaryContact: "",
      SecondaryContact: "",
      NID: "",
      ResignationDate: "",
      LeaveDate: "",
      AttendanceToggle: false,
      Qualification: "",
      Address: "",
      Telephone: "",
      Designation: "",
      Image: null,
    },
    validationSchema: Yup.object({
      // Define your validation rules here
      // For example:
      Name: Yup.string().required("Name is required"),
      // Password: Yup.string().required("Required"),
      // ... add validation for other fields ...
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        for (const key in values) {
          formData.append(key, values[key]);
        }

        const response = await axios.post(
          `${apiUrl}/hr/employees/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("New Employee Created", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.href = "/admin/dashboard";
      } catch (err) {
        console.log("error:", err);
      }
    },
  });

  useEffect(() => {
    // This will log the selected file whenever the Image field changes
    console.log("Selected file:", formik.values.Image);
  }, [formik.values.Image]);

  // const handleSubmit = () => {
  //   if (

  //   ) {
  //     toast.success("New Employee Created", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     formik.handleSubmit();
  //   } else {
  //     toast.error("Please fill up the mandatory fields", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  // };

  return (
    <>
      <p className="mt-1 z-0 text-slate-400 text-xs">
        Please Fill Up all the{" "}
        <span className="text-red-500 my-auto font-bold">*</span> Fields to Save
        New Employee
      </p>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              Name <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Name.."
              name="Name"
              value={formik.values.Name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.Name && formik.errors.Name && (
              <div className="text-red-500">{formik.errors.Name}</div>
            )}
          </div>



          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              Email <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="email"
              className={`${generalEditInputUser}`}
              placeholder="Enter Email..."
              name="Email"
              value={formik.values.Email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.Email && formik.errors.Email && (
              <div className="text-red-500">{formik.errors.Email}</div>
            )}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              NID <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter NID..."
              name="NID"
              value={formik.values.NID}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.NID && formik.errors.NID && (
              <div className="text-red-500">{formik.errors.NID}</div>
            )}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              Contact <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Contact..."
              name="Contact"
              value={formik.values.Contact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.Contact && formik.errors.Contact && (
              <div className="text-red-500">{formik.errors.Contact}</div>
            )}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Blood Group</label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Blood Group..."
              name="BloodGroup"
              value={formik.values.BloodGroup}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.BloodGroup && formik.errors.BloodGroup && (
            <div className="text-red-500">{formik.errors.BloodGroup}</div>
          )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Qualification</label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Qualification..."
              name="Qualification"
              value={formik.values.Qualification}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.Qualification && formik.errors.Qualification && (
            <div className="text-red-500">{formik.errors.Qualification}</div>
          )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              Address <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Address..."
              name="Address"
              value={formik.values.Address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.Address && formik.errors.Address && (
              <div className="text-red-500">{formik.errors.Address}</div>
            )}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Telephone</label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Telephone..."
              name="Telephone"
              value={formik.values.Telephone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.Telephone && formik.errors.Telephone && (
            <div className="text-red-500">{formik.errors.Telephone}</div>
          )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              Designation{" "}
              <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Designation..."
              name="Designation"
              value={formik.values.Designation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.Designation && formik.errors.Designation && (
              <div className="text-red-500">{formik.errors.Designation}</div>
            )}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Emergency Contact</label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Emergency Contact..."
              name="EmergencyContact"
              value={formik.values.EmergencyContact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.EmergencyContact &&
            formik.errors.EmergencyContact && (
              <div className="text-red-500">
                {formik.errors.EmergencyContact}
              </div>
            )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Secondary Contact</label>
            <input
              type="text"
              className={`${generalEditInputUser}`}
              placeholder="Enter Secondary Contact..."
              name="SecondaryContact"
              value={formik.values.SecondaryContact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.SecondaryContact &&
            formik.errors.SecondaryContact && (
              <div className="text-red-500">
                {formik.errors.SecondaryContact}
              </div>
            )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">
              Joining <span className="text-red-500 my-auto font-bold">*</span>
            </label>
            <input
              type="date"
              className={`${generalEditInputUser}`}
              placeholder="Enter Joining Date..."
              name="JoiningDate"
              value={formik.values.JoiningDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.JoiningDate && formik.errors.JoiningDate && (
              <div className="text-red-500">{formik.errors.JoiningDate}</div>
            )}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Resignation</label>
            <input
              type="date"
              className={`${generalEditInputUser}`}
              placeholder="Enter Resignation Date..."
              name="ResignationDate"
              value={formik.values.ResignationDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.ResignationDate && formik.errors.ResignationDate && (
            <div className="text-red-500">{formik.errors.ResignationDate}</div>
          )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Leave</label>
            <input
              type="date"
              className={`${generalEditInputUser}`}
              placeholder="Enter Leave Date..."
              name="LeaveDate"
              value={formik.values.LeaveDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {formik.touched.LeaveDate && formik.errors.LeaveDate && (
            <div className="text-red-500">{formik.errors.LeaveDate}</div>
          )} */}
          </div>

          <div className="w-20 md:w-40">
            <label className="text-sm md:text-base">Profile Image</label>
            <input
              type="file"
              className={`${generalEditInputUser}`}
              accept="image/*"
              name="Image"
              onChange={(e) => {
                formik.setFieldValue("Image", e.target.files[0]);
                console.log("Selected file:", formik.values.Image);
              }}
            />
          </div>
        </div>

        {formik.values.Password !== "" &&
          formik.values.Email !== "" &&
          formik.values.NID !== "" &&
          formik.values.Contact !== "" &&
          formik.values.Address !== "" &&
          formik.values.Designation !== "" &&
          formik.values.JoiningDate !== "" && (
            <button
              type="submit"
              className={`${hoverScale} ${modalButton} w-max mx-auto`}
            >
              Save
            </button>
          )}
      </form>
    </>
  );
};

export default EmployeeCreate;
