import React, { useState, useEffect } from "react";
import Disapproved from "./Disapproved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const DisapprovedInfo = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [employeeApplication, setEmployeeApplication] = useState([]);
  const [selectedLeaveID, setSelectedLeaveID] = useState(null);

  const getLeaveInformation = async () => {
    try {
      const response = await axios.get(`${apiUrl}/leave/details/2`);
      console.log(response.data.leaves);
      setEmployeeApplication(response.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaveInformation();
  }, []);

  const handleViewApplication = (leaveID) => {
    console.log("setSelectedLeaveID:", selectedLeaveID);
    // Store the Leave_ID in the selectedLeaveID state variable
    setSelectedLeaveID(leaveID);
    console.log("setSelectedLeaveIDsss:", selectedLeaveID);

    // Perform any other actions you want to do when viewing the application
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
            </tr>
          </thead>
          <tbody>
            {employeeApplication.map((item, index) => (
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
                  <button onClick={() => handleViewApplication(item.Leave_ID)}>
                    <a className="text-blue-600 dark:text-blue-500 hover:underline">
                      View Appliation
                    </a>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display the selectedLeaveID somewhere in your component if needed */}
      </div>
      {selectedLeaveID && <Disapproved id={selectedLeaveID} />}
    </>
  );
};

export default DisapprovedInfo;
