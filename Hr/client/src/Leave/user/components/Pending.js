import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";
import { hoverScale } from "../../../components/DesignStandardize";
import { toPng } from "html-to-image";

const Pending = ({ id, name, date }) => {
  const [pendingLeave, setPendingLeave] = useState("");
  const [singlePendingLeave, setSinglePendingLeave] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getPendingApplications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/leave/detailsByLeaveID/${id}`
      );
      setPendingLeave(response.data.leaves);
    } catch (error) {
      console.log([]);
    }
  };
  const getSinglePendingApplications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/employee/${pendingLeave.EmployeeID}`
      );
      setSinglePendingLeave(response.data.employeeInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSinglePendingApplications();
    getPendingApplications();
  }, [pendingLeave.EmployeeID, id]);

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
            <h2 className="text-2xl font-semibold mb-5">
              Application for leave
            </h2>

            {/*LEAVE APPLY DATE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-xl mb-3">
                Applied date : {pendingLeave.DateApplied}
              </p>
            </div>

            {/*CAUSE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-xl mb-3">
                Cause : {pendingLeave.Cause}
              </p>
            </div>

            {/*LEAVE TYPE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-xl mb-3">
                Leave Type : {pendingLeave.Type}
              </p>
            </div>

            {/*ADDRESS*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <p className="text-left text-xl mb-3">
                Address during the leave period : {pendingLeave.Address}
              </p>
            </div>

            {/*CONTACT*/}

            <div className="flex flex-col w-full gap-5 mb-5">
              <p className="text-left text-xl mb-3">
                Contact Number : {pendingLeave.Contact}
              </p>
            </div>
          </div>

          {/* SECOND-SECTION LEAVE STATUS */}
          <div className="flex-1 p-4">
            {/* Content for the second section */}
            <h2 className="text-2xl font-semibold">Leave Status</h2>

            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium text-center text-xl">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Total Leave
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Leave Applied
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Leave Due
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold text-center border-b transition duration-300 ease-in-out hover:bg-neutral-100">
                  <td className="whitespace-nowrap px-6 py-4 bg-blue-200 hover:bg-blue-400">
                    {pendingLeave.Type === "Sick" ? 9 : 7}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 bg-red-200 hover:bg-red-400">
                    {pendingLeave.Total}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 bg-green-200 hover:bg-emerald-500">
                    {pendingLeave.Type === "Sick"
                      ? singlePendingLeave.SickLeaveLeft
                      : singlePendingLeave.CasualLeaveLeft}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-left text-2xl text-blue-900">
              Current Needed leave: {pendingLeave.Total}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pending;
