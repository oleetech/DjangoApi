// EmployeeList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import EyeIcon from "@mui/icons-material/Visibility";
import UpdateEmployee from "./UpdateEmployee";
import { hoverScale } from "../../../components/DesignStandardize";
import EmployeeCreate from "./EmployeeCreate";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const EmployeeList = () => {
  const [employee, setEmployee] = useState([]);
  const [id, setID] = useState(null);
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchEmployeeData = async () => {
      await fetch(`${apiurl}/employee/all`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data, "Employee data:");
          setEmployee(data.employeeInfos || []);
        });
    };
    fetchEmployeeData();
  }, [apiurl]);

  const DeleteEmployee = async (id, username) => {
    if (window.confirm(`Are u sure u want to delete the user ${username}?`)) {
      await axios.delete(`${apiurl}/employee/${id}`);
      toast.success(`${username} Got Removed!`);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "my_modal_5") {
        document.getElementById("my_modal_5").close();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal((prevShowModal) => !prevShowModal);
  };
  const editEmployee = (idProp) => {
    setID(idProp);
    toggleModal();
  };

  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = () => {
    setAddModal((prevShowModal) => !prevShowModal);
  };

  const [attendances, setAttendances] = useState([]);

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
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/attendancebyid/${employee[0]?.EmployeeID}`;
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(apiUrl, values, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setAttendances(response.data.attendanceData || []);
        attendances.forEach((attendance, index) => {
          console.log(`Attendance ${index + 1} - Late: ${attendance?.Late}`);
        });
      } catch (error) {
        console.log("Error fetching attendance data:", error.response || error);
      }
    },
  });

  useEffect(() => {
    formik.handleSubmit();
  }, []);
  const uniqueAttendances = Array.from(
    new Set(attendances.map((attendance) => attendance.EmployeeID))
  ).map((employeeID) => {
    return attendances.find(
      (attendance) => attendance.EmployeeID === employeeID
    );
  });

  const pairedData = employee.map((employeeItem) => {
    const correspondingAttendance = uniqueAttendances.find(
      (attendanceItem) => attendanceItem.EmployeeID === employeeItem.EmployeeID
    );

    return {
      employee: employeeItem,
      uniqueAttendance: correspondingAttendance || {}, // Use an empty object if not found
    };
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-5 md:gap-8 mx-auto">
        {pairedData.map((items, index) => {
          return (
            <div
              key={index}
              class={`w-80 md:w-96 p-3 flex flex-col gap-3 md:gap-5 border rounded-lg shadow-md hover:shadow-xl text-[#0D1829B2] hover:cursor-pointer  ${
                index % 2 === 0
                  ? "bg-gradient-to-b from-[#FF7B5824] to-[#7B95F330]"
                  : "bg-gradient-to-b from-[#EAEFFF] to-[#FAF9FF]"
              }`}
            >
              <div className="flex flex-row gap-3 md:gap-5 justify-between">
                <div className="flex flex-col gap-3 justify-between">
                  <img
                    src={`${apiurl}/uploads/${items.employee.Image}`}
                    alt={items.employee.Name}
                    className="w-20 h-20 md:w-28 md:h-28 mx-auto rounded-full"
                  />
                  <div className="hidden md:block">
                    <Link
                      className={`light-button ${hoverScale}`}
                      to={`/admin/${items.employee.Name}/${items.employee.EmployeeID}`}
                    >
                      <EyeIcon />
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="hidden md:flex flex-col gap-2 w-40">
                  <p className="font-semibold text-xl">{items.employee.Name}</p>
                  <p className="text-clip overflow-hidden">
                    Designation:
                    <span className="font-semibold">
                      {" "}
                      {items.employee.Designation}
                    </span>
                  </p>
                  <p className="text-clip overflow-hidden">
                    Email:
                    <span className="font-semibold">
                      {" "}
                      {items.employee.Email}
                    </span>
                  </p>
                  <p className="text-clip overflow-hidden">
                    Contact:
                    <span className="font-semibold">
                      {" "}
                      {items.employee.Contact}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 ml-auto mb-auto">
                  <button
                    className="hover:text-[#214DED]"
                    onClick={() => {
                      editEmployee(items.employee.EmployeeID);
                    }}
                  >
                    <EditIcon fontSize="1px" />
                  </button>
                  <button
                    className="hover:text-red-500"
                    onClick={() => {
                      DeleteEmployee(
                        items.employee.EmployeeID,
                        items.employee.Name
                      );
                    }}
                  >
                    <DeleteIcon fontSize="1px" />
                  </button>
                  <div className="md:hidden block">
                    <Link
                      className={`light-button ${hoverScale}`}
                      to={`/admin/${items.employee.Name}/${items.employee.EmployeeID}`}
                    >
                      <EyeIcon />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* for small screen */}
              <div className="md:hidden flex flex-col gap-2 w-72">
                <p className="font-semibold text-xl">{items.employee.Name}</p>
                <p className="text-clip overflow-hidden">
                  Designation:
                  <span className="font-semibold">
                    {" "}
                    {items.employee.Designation}
                  </span>
                </p>
                <p className="text-clip overflow-hidden">
                  Email:
                  <span className="font-semibold"> {items.employee.Email}</span>
                </p>
                <p className="text-clip overflow-hidden">
                  Contact:
                  <span className="font-semibold">
                    {" "}
                    {items.employee.Contact}
                  </span>
                </p>
              </div>
              {/* for small screen */}
            </div>
          );
        })}
      </div>
      <Link
        className={`fixed right-0 md:right-[300px] animate-bounce bottom-0 m-5 w-max p-2 text-white border rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
        onClick={toggleAddModal}
      >
        Create employee
      </Link>

      <div className="h-20" />

      {/* modal update employee details */}
      {modal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Update User
              </h2>
              <CloseIcon
                onClick={toggleModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <UpdateEmployee id={id} />
          </div>
        </div>
      )}

      {/* modal add employee details */}
      {addModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleAddModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add New Employee
              </h2>
              <CloseIcon
                onClick={toggleAddModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <EmployeeCreate />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
