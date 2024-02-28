import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";
import { hoverScale } from "../../../components/DesignStandardize";
import { toPng } from "html-to-image";

const Approved = ({ id, name, date }) => {
  const [approvedLeave, setApprovedLeave] = useState("");
  const [singleApprovedLeave, setSingleApprovedLeave] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getApprovedApplications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/leave/detailsByLeaveID/${id}`
      );
      setApprovedLeave(response.data.leaves);
    } catch (error) {
      console.log([]);
    }
  };
  const getSingleApprovedApplications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/employee/${approvedLeave.EmployeeID}`
      );
      setSingleApprovedLeave(response.data.employeeInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleApprovedApplications();
    getApprovedApplications();
  }, [approvedLeave.EmployeeID, id]);

  const handleDownloadPDF = async () => {
    try {
      const contentDiv = document.getElementById("contentToCapture");

      if (!contentDiv) {
        console.error("Content div not found");
        return;
      }
      const dataUrl = await toPng(contentDiv);
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(dataUrl, "PNG", 10, 10, 190, 0);
      pdf.save(`${name}-Leave_Application-${date}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const isUserLoggedIn = window.localStorage.getItem("user");

  return (
    <>
      {isUserLoggedIn && (
        <div
          className={`bg-green-100 rounded-xl p-3 w-max mx-auto ${hoverScale}`}
        >
          <button
            className={`text-green-500 hover:cursor-pointer`}
            onClick={() => {
              handleDownloadPDF();
            }}
          >
            <DownloadIcon /> Download
          </button>
        </div>
      )}
      <div id="contentToCapture" className="mt-2 flex flex-col gap-3">
        <p className="text-2xl font-semibold text-blue-900">{name}</p>

        <div className="flex flex-col flex-wrap md:flex-row gap-10 md:divide-x-2 md:divide-blue-200 border-2 border-solid">
          {/*FIRST-SECTION APPLICATION*/}

          <div className="flex-1 p-4">
            {/* Content for the first section */}
            <h2 className="text-3xl font-semibold mb-5">
              Application for leave
            </h2>

            {/*LEAVE APPLY DATE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-2xl mb-3">
                Applied date : {approvedLeave.DateApplied}
              </p>
            </div>

            {/*CAUSE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-2xl mb-3">
                Cause : {approvedLeave.Cause}
              </p>
            </div>

            {/*LEAVE TYPE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-2xl mb-3">
                Leave Type : {approvedLeave.Type}
              </p>
            </div>

            {/*ADDRESS*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-2xl mb-3">
                Address during the leave period : {approvedLeave.Address}
              </p>
            </div>

            {/*CONTACT*/}

            <div className="flex flex-col w-full gap-5 mb-5">
              <p className="text-left text-2xl mb-3">
                Contact Number : {approvedLeave.Contact}
              </p>
            </div>
          </div>

          {/* SECOND-SECTION LEAVE STATUS */}

          <div className="flex-1 p-4">
            {/* Content for the second section */}
            <h2 className="text-3xl font-semibold">Leave Status</h2>

            <div className="flex flex-col mb-3">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light">
                      <thead className="border-b font-medium dark:border-neutral-500 text-center text-xl">
                        <tr>
                          <th scope="col" className="px-6 py-4">
                            Total Leave
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Leave Taken
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Leave Due
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="font-bold text-center border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                          <td className="whitespace-nowrap px-6 py-4 bg-blue-200 hover:bg-blue-400">
                            {approvedLeave.Type === "Sick" ? 9 : 7}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 bg-red-200 hover:bg-red-400">
                            {approvedLeave.Type === "Sick"
                              ? 9 - singleApprovedLeave.SickLeaveLeft
                              : 7 - singleApprovedLeave.CasualLeaveLeft}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 bg-green-200 hover:bg-emerald-500">
                            {approvedLeave.Type === "Sick"
                              ? singleApprovedLeave.SickLeaveLeft
                              : singleApprovedLeave.CasualLeaveLeft}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-left text-2xl text-blue-900">
              Current Needed leave: {approvedLeave.Total}
            </p>
          </div>

          {/* THIRD SECTION GIVE APPROVAL */}
          <div className="flex-1 p-4">
            <h2 className="text-3xl font-semibold mb-3">Approval</h2>

            <div className="flex text-2xl items-center space-x-2 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-10 w-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Approved</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approved;
