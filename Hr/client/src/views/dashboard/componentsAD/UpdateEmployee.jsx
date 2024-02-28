import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
import UpdateEmployeePassword from "./UpdateEmployeePassword";

const UpdateEmployee = ({ id }) => {
  const [employee, setEmployee] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };

  useEffect(() => {
    // Fetch employee data based on id
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/employee/${id}`);

        setEmployee(response.data.employeeInfo);
        console.log({ myemployee: response.data.employeeInfo });

        // Set formik values when employee data is fetched
        formik.setValues({
          Name: response.data.employeeInfo?.Name || "",
          Email: response.data.employeeInfo?.Email || "",
          Contact: response.data.employeeInfo?.Contact || "",
          JoiningDate: response.data.employeeInfo?.JoiningDate || "",
          BloodGroup: response.data.employeeInfo?.BloodGroup || "",
          EmergencyContact: response.data.employeeInfo?.EmergencyContact || "",
          PrimaryContact: response.data.employeeInfo?.PrimaryContact || "",
          SecondaryContact: response.data.employeeInfo?.SecondaryContact || "",
          NID: response.data.employeeInfo?.NID || "",
          ResignationDate: response.data.employeeInfo?.ResignationDate || "",
          LeaveDate: response.data.employeeInfo?.LeaveDate || "",
          Qualification: response.data.employeeInfo?.Qualification || "",
          Address: response.data.employeeInfo?.Address || "",
          Telephone: response.data.employeeInfo?.Telephone || "",
          Designation: response.data.employeeInfo?.Designation || "",
          Image: response.data.employeeInfo?.Image || "",
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      Name: employee?.Name || "",
      Email: employee?.Email || "",
      Contact: employee?.Contact || "",
      JoiningDate: employee?.JoiningDate || "",
      BloodGroup: employee?.BloodGroup || "",
      EmergencyContact: employee?.EmergencyContact || "",
      PrimaryContact: employee?.PrimaryContact || "",
      SecondaryContact: employee?.SecondaryContact || "",
      NID: employee?.NID || "",
      ResignationDate: employee?.ResignationDate || "",
      LeaveDate: employee?.LeaveDate || "",
      Qualification: employee?.Qualification || "",
      Address: employee?.Address || "",
      Telephone: employee?.Telephone || "",
      Designation: employee?.Designation || "",
      Image: employee?.Image || "",
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        for (const key in values) {
          formData.append(key, values[key]);
        }

        await axios.put(`${apiUrl}/employee/updateemployee/${id}`, formData);
        toast.success("Employee updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    },
  });

  return (
    <>
      <div role="tablist" className="tabs tabs-lifted text-[28px]">
        <a
          role="tab"
          className={`tab ${toggleState === 1 && "tab-active"}`}
          onClick={() => {
            changeTab(1);
          }}
        >
          Info
        </a>
        <a
          role="tab"
          className={`tab ${toggleState === 2 && "tab-active"}`}
          onClick={() => {
            changeTab(2);
          }}
        >
          Password
        </a>
      </div>

      {toggleState === 1 ? (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {/* Input fields */}
            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Name</label>
              <input
                id="Name"
                name="Name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Name}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Email</label>
              <input
                id="Email"
                name="Email"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Email}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Contact</label>
              <input
                id="Contact"
                name="Contact"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Contact}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Blood Group</label>
              <input
                id="BloodGroup"
                name="BloodGroup"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.BloodGroup}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">NID</label>
              <input
                id="NID"
                name="NID"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.NID}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Qualification</label>
              <input
                id="Qualification"
                name="Qualification"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Qualification}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Address</label>
              <input
                id="Address"
                name="Address"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Address}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Telephone</label>
              <input
                id="Telephone"
                name="Telephone"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Telephone}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Designation</label>
              <input
                id="Designation"
                name="Designation"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Designation}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Joining</label>
              <input
                id="JoiningDate"
                name="JoiningDate"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.JoiningDate}
                className={`${generalEditInputUser}`}
              />
            </div>
            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Resignation</label>
              <input
                id="ResignationDate"
                name="ResignationDate"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.ResignationDate}
                className={`${generalEditInputUser}`}
              />
            </div>
            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Leave</label>
              <input
                id="LeaveDate"
                name="LeaveDate"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.LeaveDate}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Emergency Contact</label>
              <input
                id="EmergencyContact"
                name="EmergencyContact"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.EmergencyContact}
                className={`${generalEditInputUser}`}
              />
            </div>
            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Primary Contact</label>
              <input
                id="PrimaryContact"
                name="PrimaryContact"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.PrimaryContact}
                className={`${generalEditInputUser}`}
              />
            </div>
            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Secondary Contact</label>
              <input
                id="SecondaryContact"
                name="SecondaryContact"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.SecondaryContact}
                className={`${generalEditInputUser}`}
              />
            </div>

            <div className="w-20 md:w-40">
              <label className="text-sm md:text-base">Image</label>
              <input
                id="Image"
                name="Image"
                type="file"
                className={`${generalEditInputUser}`}
                onChange={(event) =>
                  formik.setFieldValue("Image", event.target.files[0])
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className={`${hoverScale} ${modalButton} w-max py-2 mx-auto`}
          >
            Update Employee
          </button>
        </form>
      ) : (
        <UpdateEmployeePassword id={id} />
      )}
    </>
  );
};

export default UpdateEmployee;
