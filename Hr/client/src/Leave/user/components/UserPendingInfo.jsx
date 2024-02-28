import React, { useEffect, useState } from "react";
import Pending from "./Pending";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import CloseIcon from "@mui/icons-material/Close";
import EditLeaveApplication from "./EditLeaveApplication";
import { hoverScale } from "../../../components/DesignStandardize";
import { toast } from "react-toastify";

const UserPendingInfo = ({ id, isAdmin }) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [pendingApplications, setPendingApplications] = useState([]);
  const [selectedLeaveID, setSelectedLeaveID] = useState(null);
  const [selectedLeaveName, setSelectedLeaveName] = useState("");
  const [selectedLeaveDate, setSelectedLeaveDate] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const toggleEditModal = (id) => {
    setShowEditModal((prevShowEditModal) => !prevShowEditModal);
  };

  const getPendingApplication = async () => {
    try {
      const response = await axios.get(`${apiUrl}/leave/detailsEmpID/${id}/0`);
      setPendingApplications(response.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPendingApplication();
  }, [id]);

  const handDeleteApplications = async (LeaveID, AppliedDate) => {
    if (
      window.confirm(
        `Are u sure u want to delete the application for ${AppliedDate}?`
      )
    ) {
      const response = await axios.delete(`${apiUrl}/leave/delete/${LeaveID}`);
      toast.success("Leave Application Deleted");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <>
      <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto mt-10">
        <table className="min-w-full text-center text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-700">
            <tr>
              <th scope="col" className="px-6 py-4">
                Employee Name
                <FontAwesomeIcon icon={faUser} className="pl-2" />
              </th>
              <th scope="col" className="px-6 py-4">
                Applied Date
                <FontAwesomeIcon icon={faCalendarDays} className="pl-2" />
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>

              <th scope="col" className="px-6 py-4">
                View Application
                <FontAwesomeIcon icon={faEye} className="ml-2" />
              </th>
              {isAdmin === 0 && (
                <>
                  <th scope="col" className={`px-6 py-4`}>
                    Edit
                  </th>
                  <th scope="col" className={`px-6 py-4`}>
                    Delete
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map((item, index) => (
              <tr
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                key={index}
              >
                <td className="whitespace-nowrap px-6 py-4">{item.Name}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {item.DateApplied}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {(() => {
                    switch (item.Status) {
                      case 0:
                        return (
                          <div className="text-amber-500 pl-30">
                            <p>
                              <FontAwesomeIcon
                                icon={faEllipsis}
                                fade
                                className="pr-2"
                              />
                              Pending
                            </p>
                          </div>
                        );
                      case 1:
                        return (
                          <div className="text-green-500 pl-30">
                            <p>
                              <FontAwesomeIcon
                                icon={faCheck}
                                beat
                                className=""
                              />
                              Approved
                            </p>
                          </div>
                        );
                      case 2:
                        return (
                          <div className="text-red-600 pl-30">
                            <p>
                              <FontAwesomeIcon
                                icon={faExclamation}
                                beat
                                className="pr-2"
                              />
                              Dispproved
                            </p>
                          </div>
                        );

                      default:
                        return "Unknown Status";
                    }
                  })()}{" "}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <a
                    onClick={() => {
                      setSelectedLeaveID(item.Leave_ID);
                      setSelectedLeaveName(item.Name);
                      setSelectedLeaveDate(item.DateApplied);
                    }}
                    className="text-blue-600 dark:text-blue-500 hover:underline hover:cursor-pointer"
                  >
                    View Appliation
                  </a>
                </td>
                {isAdmin === 0 && (
                  <>
                    <td>
                      <button
                        className={`text-blue-500 hover:cursor-pointer ${hoverScale}`}
                        onClick={() => {
                          setSelectedLeaveID(item.Leave_ID);
                          toggleEditModal();
                        }}
                      >
                        <EditIcon />
                      </button>
                    </td>
                    <td>
                      <button
                        className={`text-red-500 hover:cursor-pointer ${hoverScale}`}
                        onClick={() =>
                          handDeleteApplications(
                            item.Leave_ID,
                            item.DateApplied
                          )
                        }
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLeaveID && (
        <Pending
          id={selectedLeaveID}
          name={selectedLeaveName}
          date={selectedLeaveDate}
        />
      )}

      {showEditModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleEditModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Edit Leave Application
              </h2>
              <CloseIcon
                onClick={toggleEditModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <EditLeaveApplication id={selectedLeaveID} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserPendingInfo;
