import axios from "axios";
import { useEffect, useState } from "react";
const Disapproved = ({ id }) => {
  const [disApprovedLeave, setDisApprovedLeave] = useState("");
  const [singleDisApprovedLeave, setSingleDisApprovedLeave] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getDisApprovedApplications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/leave/detailsByLeaveID/${id}`
      );
      console.log(response.data.leaves || []);
      setDisApprovedLeave(response.data.leaves);
    } catch (error) {
      console.log([]);
    }
  };
  const getSingleDisApprovedApplications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/employee/${disApprovedLeave.EmployeeID}`
      );
      console.log(response.data.employeeInfo);
      setSingleDisApprovedLeave(response.data.employeeInfo);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(disApprovedLeave.Total);
  useEffect(() => {
    getSingleDisApprovedApplications();
  }, [disApprovedLeave.EmployeeID]);
  useEffect(() => {
    getDisApprovedApplications();
  }, [id]);
  return (
    <div className="flex mt-20 flex-col flex-wrap md:flex-row gap-10 md:divide-x-2 md:divide-blue-200">
      {/*FIRST-SECTION APPLICATION*/}

      <div className="flex-1 p-4">
        {/* Content for the first section */}
        <h2 className="text-3xl font-semibold mb-5">Application for leave</h2>

        {/*LEAVE APPLY DATE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-2xl mb-3">
            Applied date : {disApprovedLeave.DateApplied}
          </p>
        </div>

        {/*CAUSE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-2xl mb-3">
            Cause : {disApprovedLeave.Cause}
          </p>
        </div>

        {/*LEAVE TYPE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-2xl mb-3">
            Leave Type : {disApprovedLeave.Type}
          </p>
        </div>

        {/*ADDRESS*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-2xl mb-3">
            Address during the leave period : {disApprovedLeave.Address}
          </p>
        </div>

        {/*CONTACT*/}

        <div className="flex flex-col w-full gap-5 mb-5">
          <p className="text-left text-2xl mb-3">
            Contact Number : {disApprovedLeave.Contact}
          </p>
        </div>
      </div>

      {/* SECOND-SECTION LEAVE STATUS */}

      <div className="flex-1 p-4">
        {/* Content for the second section */}
        <h2 className="text-3xl font-semibold">Leave Status</h2>

        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500 text-center text-xl">
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
            <tr className="font-bold text-center border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
              <td className="whitespace-nowrap px-6 py-4 bg-blue-200 hover:bg-blue-400">
                {disApprovedLeave.Type === "Sick" ? 9 : 7}
              </td>
              <td className="whitespace-nowrap px-6 py-4 bg-red-200 hover:bg-red-400">
                {disApprovedLeave.Total}
              </td>
              <td className="whitespace-nowrap px-6 py-4 bg-green-200 hover:bg-emerald-500">
                {disApprovedLeave.Type === "Sick"
                  ? singleDisApprovedLeave.SickLeaveLeft
                  : singleDisApprovedLeave.CasualLeaveLeft}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-left text-2xl text-blue-900">
          Current Needed leave: {disApprovedLeave.Total}
        </p>
      </div>

      {/* THIRD SECTION GIVE APPROVAL */}
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-semibold mb-3">Approval</h2>

        <div className="flex items-center text-2xl space-x-2 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Disapproved</span>
        </div>
      </div>
    </div>
  );
};

export default Disapproved;
