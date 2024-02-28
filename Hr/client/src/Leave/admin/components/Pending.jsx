import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Pending = ({ id }) => {
  console.log(id);
  const [approve, setApprove] = useState(false);
  const [disapprove, setDisapprove] = useState(false);
  // const id = useParams();
  const [leaveInfo, setLeaveInfo] = useState("");
  const [status, setStatus] = useState(0);

  const [singleLeaveInfo, setSingleLeaveInfo] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const handleApproveChange = async () => {
    setApprove(!approve);
    // If you want to set disapprove to false when approve is selected
    try {
      await updateLeaveForEmployees();
      const data = {
        Status: 1,
      };

      const response = await axios.put(`${apiUrl}/leave/update/${id}`, data);
      toast.success("Leave has been Approved");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.success("An error has occured!");
      console.log(error);
    }
    if (!approve) {
      setDisapprove(false);
    }
  };
  const updateLeaveForEmployees = async () => {
    try {
      const data = {
        totalDates: leaveInfo.Total,
      };
      if (leaveInfo.Type === "Sick") {
        const response = await axios.put(
          `${apiUrl}/employee/ELeaveUpdate/${leaveInfo.EmployeeID}`,
          data
        );
        console.log(response.data);
      } else {
        const response = await axios.put(
          `${apiUrl}/employee/CLeaveUpdate/${leaveInfo.EmployeeID}`,
          data
        );
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getIndividualLeaveInfo = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/employee/${leaveInfo.EmployeeID}`
      );
      console.log(response.data);
      setSingleLeaveInfo(response.data.employeeInfo);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getIndividualLeaveInfo();
  }, [leaveInfo.EmployeeID]);
  const getLeaveInformation = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/leave/detailsByLeaveID/${id}`
      );
      console.log(response.data.leaves);
      setLeaveInfo(response.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLeaveInformation();
  }, [id]);
  const handleDisapproveChange = async () => {
    setDisapprove(!disapprove);
    try {
      const data = {
        Status: 2,
      };
      const response = await axios.put(`${apiUrl}/leave/update/${id}`, data);
      console.log(response.data);
      toast.success("Leave Application Denied!!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
    }
    // If you want to set approve to false when disapprove is selected
    if (!disapprove) {
      setApprove(false);
    }
  };
  return (
    <div className="flex mt-20 flex-col flex-wrap lg:flex-row gap-10 md:divide-x-2 md:divide-blue-200">
      {/*FIRST-SECTION APPLICATION*/}
      <div className="flex-1 p-4">
        {/* Content for the first section */}
        <h2 className="text-2xl font-semibold mb-5">Application for leave</h2>

        {/*LEAVE APPLY DATE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl mb-3">
            Applied date :{leaveInfo.DateApplied}
          </p>
        </div>

        {/*CAUSE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl">Cause : {leaveInfo.Cause}</p>
        </div>

        {/*LEAVE TYPE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl mb-3">
            Leave Type : {leaveInfo.Type}
          </p>
        </div>

        {/*ADDRESS*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl mb-3">
            Address during the leave period : {leaveInfo.Address}
          </p>
        </div>

        {/*CONTACT*/}

        <div className="flex flex-col w-full gap-5 mb-5">
          <p className="text-left text-xl mb-3">
            Contact Number : {leaveInfo.Contact}
          </p>
        </div>
      </div>

      {/* SECOND-SECTION LEAVE STATUS */}

      <div className="flex-1 p-4">
        {/* Content for the second section */}
        <h2 className="text-2xl font-semibold">Leave Status</h2>

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
                        {leaveInfo.Type === "Sick" ? 9 : 7}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 bg-red-200 hover:bg-red-400">
                        {leaveInfo.Total}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 bg-green-200 hover:bg-emerald-500">
                        {leaveInfo.Type === "Sick"
                          ? singleLeaveInfo.SickLeaveLeft
                          : singleLeaveInfo.CasualLeaveLeft}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <p className="text-left text-2xl text-blue-900">
          Current Needed leave: {leaveInfo.Total}
        </p>
      </div>

      {/* THIRD SECTION GIVE APPROVAL */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-semibold mb-5">Approval</h2>

        <p className="text-center text-2xl mb-3">
          Do you approve this application?
        </p>

        <div class="flex items-center mb-4 text-xl">
          <input
            id="approve-checkbox"
            type="checkbox"
            value=""
            checked={approve}
            onChange={handleApproveChange}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="default-checkbox"
            class="ms-2 font-medium text-gray-900 dark:text-gray-300"
          >
            Approve
          </label>
        </div>

        <div class="flex items-center mb-4 text-xl">
          <input
            id="disapprove-checkbox"
            type="checkbox"
            onChange={handleDisapproveChange}
            checked={disapprove}
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="default-checkbox"
            class="ms-2 font-medium text-gray-900 dark:text-gray-300"
          >
            Disapprove
          </label>
        </div>
      </div>
    </div>
  );
};

export default Pending;
