import React, { useEffect, useState } from "react";
import {
  allFirstDiv,
  generalEditInputUser,
  hoverScale,
} from "../../../components/DesignStandardize";
import Navbar from "../../../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageTitle from "../../../components/PageTitle";
import AddProjects from "../../projects/AddProjects";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import GetToDoListDateUser from "../../TodoList/employee/GetToDoListDateUser";
import SeeApplication from "../../../Leave/user/components/SeeApplication";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import { toast } from "react-toastify";
import UpdateEmployee from "./UpdateEmployee";
import ProjectList from "../../projects/ProjectList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignIn,
  faSignOut,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";

const EmployeeIndividualList = () => {
  const [toggleState, setToggleState] = useState(0);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal((prevShowModal) => !prevShowModal);
  };
  const [attendances, setAttendances] = useState([]);
  const { EmployeeID } = useParams();
  const uniqueNames = new Set();
  // Separate validation schema
  const validationSchema = Yup.object({
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/attendancebyid/${EmployeeID}`;
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

  const [employee, setEmployee] = useState(null);
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/employee/${EmployeeID}`);

        setEmployee(response.data.employeeInfo);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [EmployeeID, apiUrl]);

  const DeleteEmployee = async (id, username) => {
    if (window.confirm(`Are u sure u want to delete the user ${username}?`)) {
      await axios.delete(`${apiUrl}/employee/${id}`);
      toast.success(`${username} Got Removed!`);
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 500);
    }
  };
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };

  const redirectToLocation = (latitude, longitude) => {
    const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapURL, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className={`${allFirstDiv} md:px-2`}>
        {employee !== null && (
          <PageTitle title={`Employee - ${employee.Name}`} />
        )}

        <div className="flex flex-col gap-6 pt-2 md:pt-20">
          {/* Employee card */}
          {employee !== null && (
            <div
              class={`w-11/12 md:w-2/3 mx-auto px-2 py-4 flex flex-col gap-3 md:gap-5 border rounded-lg shadow-xl text-[#0D1829B2] bg-gradient-to-b from-[#FF7B5824] to-[#7B95F330]
            `}
            >
              <div className="flex flex-row gap-3 md:gap-5 justify-between">
                <img
                  src={`${apiUrl}/uploads/${employee.Image}`}
                  alt={employee.Name}
                  className="w-20 h-20 md:w-28 md:h-28 mx-auto rounded-full my-auto md:my-0"
                />

                <div className="hidden md:flex flex-col gap-2 w-40 md:w-52 lg:w-80">
                  <p className="font-semibold text-xl">{employee.Name}</p>
                  <p className="text-clip overflow-hidden">
                    Designation:
                    <span className="font-semibold">
                      {" "}
                      {employee.Designation}
                    </span>
                  </p>
                  <p className="text-clip overflow-hidden">
                    Email:
                    <span className="font-semibold"> {employee.Email}</span>
                  </p>
                  <p className="text-clip overflow-hidden">
                    Contact:
                    <span className="font-semibold"> {employee.Contact}</span>
                  </p>
                  <p className="text-clip overflow-hidden">
                    NID:
                    <span className="font-semibold"> {employee.NID}</span>
                  </p>
                  <p>
                    Blood Group:
                    <span className="font-semibold">
                      {" "}
                      {employee.BloodGroup}
                    </span>
                  </p>
                  <p className="text-clip overflow-hidden">
                    Address:
                    <span className="font-semibold"> {employee.Address}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-ellipsis overflow-hidden ...">
                    <p>
                      Casual Leave Left:
                      <p className="font-semibold">
                        {employee.CasualLeaveLeft}
                      </p>
                    </p>
                    <p>
                      Sick Leave Left:{" "}
                      <p className="font-semibold">{employee.SickLeaveLeft}</p>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 ml-auto mb-auto">
                  <button
                    className="hover:text-[#214DED]"
                    onClick={toggleEditModal}
                  >
                    <EditIcon fontSize="1px" />
                  </button>
                  <button
                    className="hover:text-red-500"
                    onClick={() => {
                      DeleteEmployee(employee.EmployeeID, employee.Name);
                    }}
                  >
                    <DeleteIcon fontSize="1px" />
                  </button>
                </div>
              </div>

              {/* for small screen */}
              <div className="md:hidden flex flex-col gap-2 w-full">
                <p className="font-semibold text-xl">{employee.Name}</p>
                <p className="text-clip overflow-hidden">
                  Designation:
                  <span className="font-semibold"> {employee.Designation}</span>
                </p>
                <p className="text-clip overflow-hidden">
                  Email:<span className="font-semibold"> {employee.Email}</span>
                </p>
                <p className="text-clip overflow-hidden">
                  Contact:
                  <span className="font-semibold"> {employee.Contact}</span>
                </p>
                <p className="text-clip overflow-hidden">
                  NID:
                  <span className="font-semibold"> {employee.NID}</span>
                </p>
                <p className="text-clip overflow-hidden">
                  Blood Group:
                  <span className="font-semibold"> {employee.BloodGroup}</span>
                </p>
                <p className="text-clip overflow-hidden">
                  Address:
                  <span className="font-semibold"> {employee.Address}</span>
                </p>
              </div>
              {/* for small screen */}
            </div>
          )}

          {/* Tabs */}
          <div
            role="tablist"
            className="tabs tabs-boxed text-[28px] font-Inter md:w-max mx-2 md:mx-auto flex flex-row flex-wrap justify-center"
          >
            <a
              role="tab"
              className={`tab ${toggleState === 0 && "tab-active"}`}
              onClick={() => {
                changeTab(0);
              }}
            >
              Projects
            </a>
            <a
              role="tab"
              className={`tab ${toggleState === 1 && "tab-active"}`}
              onClick={() => {
                changeTab(1);
              }}
            >
              Attendance
            </a>
            <a
              role="tab"
              className={`tab ${toggleState === 2 && "tab-active"}`}
              onClick={() => {
                changeTab(2);
              }}
            >
              Daily Tasks
            </a>
            {/* <a
              role="tab"
              className={`tab ${toggleState === 3 && "tab-active"}`}
              onClick={() => {
                changeTab(3);
              }}
            >
              To-Do
            </a> */}
            <a
              role="tab"
              className={`tab ${toggleState === 4 && "tab-active"}`}
              onClick={() => {
                changeTab(4);
              }}
            >
              Leave Application
            </a>
          </div>

          <button
            className={`fixed right-5 animate-bounce bottom-0 m-5 w-max p-2 text-white border rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
            onClick={toggleModal}
          >
            Add Project
          </button>

          <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto p-2">
            {toggleState === 0 && <ProjectList />}

            {toggleState === 1 && (
              <div className="flex flex-col gap-3">
                {/* select date */}
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2 w-80">
                    <label className="w-28 my-auto">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      className={`${generalEditInputUser} ${
                        formik.touched.startDate && formik.errors.startDate
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="flex gap-2 w-80">
                    <label className="w-28 my-auto">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className={`${generalEditInputUser} ${
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
                    className={`light-button ${hoverScale} m-2`}
                  >
                    Get Attendance
                  </button>
                </form>

                <table className="min-w-full text-center text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-700">
                    <tr className="sticky top-0 bg-white">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">
                        LogIn Time{" "}
                        <FontAwesomeIcon icon={faSignIn} className="pl-2" />
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
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Late</th>
                      <th className="pb-2">Leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances &&
                      attendances.map((entry, index) => (
                        <tr
                          className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                          key={entry.index}
                        >
                          <td className="w-[173px] h-[64px]">
                            {entry.EmployeeInfo.Name}
                          </td>
                          <td className="w-[173px] h-[64px]">
                            {entry.LoginTime && entry.LoginTime}
                          </td>
                          <td className="w-[173px] h-[64px]">
                            {entry.LogoutTime && entry.LogoutTime}
                          </td>
                          <td
                            className="w-[173px] h-[64px] hover:cursor-pointer hover:text-blue-500"
                            onClick={() =>
                              redirectToLocation(
                                entry.Latitude,
                                entry.Longitude
                              )
                            }
                          >
                            {entry.Date && entry.locationName}
                          </td>

                          <td className="w-[173px] h-[64px]">
                            {entry.Date && entry.Date}
                          </td>
                          <td className="w-[173px] h-[64px]">
                            {entry.Late && entry.Late === 0
                              ? "On-time"
                              : "Late"}
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
            )}

            {toggleState === 2 && (
              <div className="flex flex-col gap-3">
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2 w-80">
                    <label className="w-28 my-auto">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      className={`${generalEditInputUser} ${
                        formik.touched.startDate && formik.errors.startDate
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="flex gap-2 w-80">
                    <label className="w-28 my-auto">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className={`${generalEditInputUser} ${
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
                    className={`light-button ${hoverScale} m-2`}
                  >
                    See Tasks
                  </button>
                </form>

                <table className="min-w-full text-center text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-700">
                    <tr className="sticky top-0 bg-white">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">
                        10:15 a.m <br />
                        to <br /> 12:15 p.m
                      </th>
                      <th className="pb-2">
                        12:15 p.m <br />
                        to <br /> 2:15 p.m
                      </th>
                      <th className="pb-2">
                        2:15 p.m <br /> to <br /> 4:15 p.m
                      </th>
                      <th className="pb-2">
                        4:15 p.m <br /> to <br /> 6:15 p.m
                      </th>
                      <th className="pb-2">LateTask</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances &&
                      attendances.map((entry, index) => {
                        // Check if the name is already added to the Set
                        if (!uniqueNames.has(entry.EmployeeInfo.Name)) {
                          // If not, add the name to the Set and render the row
                          uniqueNames.add(entry.EmployeeInfo.Name);

                          return (
                            <tr key={index}>
                              <td className="w-[173px] h-[64px]">
                                {entry.EmployeeInfo.Name}
                              </td>
                              <td className="w-[173px] h-[64px]">
                                {entry.Daily_Task1}
                              </td>
                              <td className="w-[173px] h-[64px]">
                                {entry.Daily_Task2}
                              </td>
                              <td className="w-[173px] h-[64px]">
                                {entry.Daily_Task3}
                              </td>
                              <td className="w-[173px] h-[64px]">
                                {entry.Daily_Task4}
                              </td>
                              <td className="w-[173px] h-[64px]">
                                {entry.Late_Task}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {/* {toggleState === 3 && (
              <GetToDoListDateUser
                id={EmployeeID}
                myCalendar={false}
                isAdmin={true}
                todo={true}
              />
            )} */}

            {toggleState === 4 && (
              <SeeApplication idProps={EmployeeID} isAdmin={1} />
            )}
          </div>
        </div>

        <div className="h-20" />
      </div>

      {modal && (
        <div className="z-10 fixed inset-0 flex employee-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleModal}
          />
          <div className="card h-max bg-white z-20 p-4 flex flex-col gap-3 my-auto">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add Project
              </h2>
              <CloseIcon
                onClick={toggleModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <AddProjects />
          </div>
        </div>
      )}

      {/* modal update employee details */}
      {editModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleEditModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Update User
              </h2>
              <CloseIcon
                onClick={toggleEditModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <UpdateEmployee id={EmployeeID} />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeIndividualList;
