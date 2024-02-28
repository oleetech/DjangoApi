import axios from "axios";
import { useEffect, useState } from "react";

const Approved = ({id}) => {
  const [approvedLeave,setApprovedLeave] = useState("");
  const [singleApprovedLeave,setSingleApprovedLeave] = useState("")
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getApprovedApplications = async()=>{
    try {
      const response = await axios.get(`${apiUrl}/leave/detailsByLeaveID/${id}`);
      console.log(response.data.leaves||[]);
      setApprovedLeave(response.data.leaves)
    } catch (error) {
      console.log([]);
    }
  }
  const getSingleApprovedApplications = async()=>{
    try {
      const response = await axios.get(`${apiUrl}/employee/${approvedLeave.EmployeeID}`);
      console.log(response.data.employeeInfo);
      setSingleApprovedLeave(response.data.employeeInfo);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(approvedLeave.Total);
  useEffect(()=>{
   getSingleApprovedApplications();
  },[approvedLeave.EmployeeID])
  useEffect(()=>{
   getApprovedApplications();
  },[id])
  return (
    <div className="flex mt-20 flex-col flex-wrap lg:flex-row gap-10 md:divide-x-2 md:divide-blue-200">
      {/*FIRST-SECTION APPLICATION*/}

      <div className="flex-1 p-4">
        {/* Content for the first section */}
        <h2 className="text-2xl font-semibold mb-5">Application for leave</h2>

        {/*LEAVE APPLY DATE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl mb-3">Applied date : {approvedLeave.DateApplied}</p>
        </div>

        {/*CAUSE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl">Cause : {approvedLeave.Cause}</p>
        </div>

        {/*LEAVE TYPE*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl mb-3">Leave Type : {approvedLeave.Type}</p>
        </div>

        {/*ADDRESS*/}

        <div className="flex flex-col w-full gap-5 mb-3">
          <p className="text-left text-xl mb-3">
            Address during the leave period : {approvedLeave.Address}
          </p>
        </div>

        {/*CONTACT*/}

        <div className="flex flex-col w-full gap-5 mb-5">
          <p className="text-left text-xl mb-3">Contact Number : {approvedLeave.Contact}</p>
        </div>
      </div>

      {/* SECOND-SECTION LEAVE STATUS */}

      <div className="flex-1 p-4">
        {/* Content for the second section */}
        <h2 className="text-2xl font-semibold mb-5">Leave Status</h2>
        <div className="flex">
        <h2 className="text-2xl font-semibold">Leave Type : </h2>
        <h2 className="text-2xl font-semibold">{approvedLeave.Type==="Sick"?<>Sick Leave</>:<>Casual Leave</>}</h2>
        </div>
        
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
                      <td className="whitespace-nowrap px-6 py-4 bg-blue-200 hover:bg-blue-400">{approvedLeave.Type==="Sick"?9:7}</td>
                      <td className="whitespace-nowrap px-6 py-4 bg-red-200 hover:bg-red-400">{approvedLeave.Type==="Sick"?(9-singleApprovedLeave.SickLeaveLeft):(7-singleApprovedLeave.CasualLeaveLeft)}</td>
                      <td className="whitespace-nowrap px-6 py-4 bg-green-200 hover:bg-emerald-500">{approvedLeave.Type==="Sick"?singleApprovedLeave.SickLeaveLeft:singleApprovedLeave.CasualLeaveLeft}</td>
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
        <h2 className="text-2xl font-semibold mb-3">Approval</h2>

       

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
  );
};

export default Approved;
