import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { monthNumberToAbbreviation } from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
import moment from "moment-timezone";

const LeaveApplicationForm = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDates, setTotalDates] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [appliedDate, setAppliedDate] = useState("");
  const [type, setType] = useState("");
  const [Address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [cause, setCause] = useState("");
  const [user, setUser] = useState(null);
  const [singleUser, setSingleUser] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  // Function to calculate total dates
  const LeaveType = ["Sick", "Casual"];
  const calculateTotalDates = (start, end) => {
    if (!start || !end) return 0;

    let totalDays = 0;

    // Iterate over each day in the range
    let currentDate = new Date(start);
    while (currentDate <= end) {
      // Check if the day is not Friday (5)
      if (currentDate.getDay() !== 5) {
        totalDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDays;
  };

  const isWeekday = (date) => {
    // Disable Fridays (5)
    return date.getDay() !== 5;
  };

  const onChange = (dates) => {
    const [start, end] = dates;

    // Check if the selected range exceeds 3 days
    if (start && end) {
      const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (daysDifference > 3) {
        // If more than 3 days are selected, reset the dates
        setStartDate(null);
        setEndDate(null);
        return;
      }
    }
    setStartDate(start);
    setEndDate(end);

    const newTotalDates = calculateTotalDates(start, end);
    setTotalDates(newTotalDates);

    // Store selected dates in an array
    const datesArray = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      if (currentDate.getDay() !== 5) {
        datesArray.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const isoDatesArray = datesArray.map((date) =>
      moment(date).tz("Asia/Dhaka").format()
    );
    setSelectedDates(isoDatesArray);
  };

  // Calculate remaining leave days (Due)
  const maxLeaveSickDays = 9;
  const maxLeaveCasualDays = 7;
  const SickDue = maxLeaveSickDays - singleUser.SickLeaveLeft;
  const CasualDue = maxLeaveCasualDays - singleUser.CasualLeaveLeft;

  const isExceedingLeave =
    (type === "Casual" && totalDates > singleUser.CasualLeaveLeft) ||
    (type === "Sick" && totalDates > singleUser.SickLeaveLeft);
  const userString = localStorage.getItem("user");
  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, [userString]);

  const getLeaveInfo = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `${apiUrl}/employee/${user.employeeID}`
        );
        setSingleUser(response.data.employeeInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      getLeaveInfo();
    }
  }, [user ? user.employeeID : ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [year, monthNumber, day] = appliedDate?.split("-") || [];
    const month = monthNumberToAbbreviation[monthNumber];
    const data = {
      DateApplied: appliedDate,
      Date: JSON.stringify(selectedDates),
      Month: month,
      Total: totalDates,
      Type: type,
      Address: Address,
      Contact: contact,
      Cause: cause,
      Name: user.Name,
      Designation: user.Designation,
      EmployeeID: user.employeeID,
    };
    console.log(data);
    try {
      const response = await axios.post(`${apiUrl}/leave/create`, data);
      console.log(response.data);
      toast.success("Leave Application Successful");
      setTimeout(() => {
        window.location.reload();
        window.location.href = "/employee/leave-Application";
      }, 500);
    } catch (error) {
      toast.error("Leave Application Failed!");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        <p class="font-bold">Important!</p>
        <p>You can't apply for more than 3 days at a time</p>
      </div>

      <div className="flex flex-row-reverse flex-wrap gap-10 px-4">
        {/* SECOND-SECTION LEAVE STATUS */}
        <div className="flex-1 flex flex-col gap-5 bg-blue-50 p-2 md:p-4 h-max">
          {/* Content for the second section */}
          <h2 className="text-2xl font-semibold">Leave Status</h2>

          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-2xl font-semibold text-blue-900">
                Summary :
              </h3>
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
                    <td className="px-6 py-4 bg-blue-200 hover:bg-blue-400">
                      {maxLeaveCasualDays + maxLeaveSickDays}
                    </td>
                    <td className="px-6 py-4 bg-red-200 hover:bg-red-400">
                      {CasualDue + SickDue}
                    </td>
                    <td className="px-6 py-4 bg-green-200 hover:bg-emerald-500">
                      {/* {due > 0 ? due : "No due left"} */}
                      {singleUser.CasualLeaveLeft + singleUser.SickLeaveLeft}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="divider m-0" />

            <div>
              <h3 className="text-2xl font-semibold text-blue-900">
                Casual Leave :
              </h3>
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
                    <td className="px-6 py-4 bg-blue-200 hover:bg-blue-400">
                      {maxLeaveCasualDays}
                    </td>
                    <td className="px-6 py-4 bg-red-200 hover:bg-red-400">
                      {CasualDue}
                    </td>
                    <td className="px-6 py-4 bg-green-200 hover:bg-emerald-500">
                      {/* {due > 0 ? due : "No due left"} */}
                      {singleUser.CasualLeaveLeft}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="divider m-0" />

            <div>
              <h3 className="text-2xl font-semibold text-blue-900">
                Sick Leave :
              </h3>
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
                    <td className="px-6 py-4 bg-blue-200 hover:bg-blue-400">
                      {maxLeaveSickDays}
                    </td>
                    <td className="px-6 py-4 bg-red-200 hover:bg-red-400">
                      {SickDue}
                    </td>
                    <td className="px-6 py-4 bg-green-200 hover:bg-emerald-500">
                      {/* {due > 0 ? due : "No due left"} */}
                      {singleUser.SickLeaveLeft}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/*FIRST-SECTION APPLICATION*/}
        <div className="flex-1">
          {/* Content for the first section */}
          <h2 className="text-2xl font-semibold">Application for leave</h2>

          {/*CALENDER*/}
          <p className="text-left text-xl mb-5 divider divider-start divider-info w-4/5">
            Select Dates
          </p>

          <div className="z-0 relative">
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              filterDate={isWeekday}
              className="mb-3 z-0"
              //monthsShown={2}
            />
          </div>

          {/*FORM*/}
          <form onSubmit={handleSubmit}>
            {/*LEAVE APPLY DATE*/}

            <div className="flex flex-col gap-5 mb-3">
              <p className="text-left text-xl mb-3 divider divider-start divider-info w-4/5">
                Applied Date
              </p>

              <input
                type="date"
                value={appliedDate}
                placeholder="Applied Date"
                onChange={(e) => setAppliedDate(e.target.value)}
                className="input input-bordered input-info max-w-xs"
              />
            </div>

            {/*CAUSE*/}
            <div className="flex flex-col gap-5 mb-3">
              <p className="text-left text-xl divider divider-start divider-info w-4/5">
                Cause
              </p>

              <textarea
                placeholder="Write the cause"
                value={cause}
                className="mb-3 textarea textarea-bordered textarea-info textarea-lg w-3/5 max-w-xs"
                onChange={(e) => setCause(e.target.value)}
              />
            </div>

            {/*LEAVE TYPE*/}

            <div className="flex flex-col w-full gap-5 mb-3">
              <label className="text-left text-xl mb-3 divider divider-start divider-info w-4/5">
                Leave Type <span className="font-semibold text-red-500">*</span>
              </label>
              <select
                id="leaveType"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input input-bordered input-info w-full max-w-xs"
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                {LeaveType.map((leaveType) => (
                  <option key={leaveType} value={leaveType}>
                    {leaveType}
                  </option>
                ))}
              </select>
            </div>

            {/*ADDRESS*/}

            <div className="flex flex-col gap-5 mb-3">
              <p className="text-left text-xl mb-3 divider divider-start divider-info w-4/5">
                Address during the leave period
              </p>

              <input
                type="text"
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Type here"
                className="input input-bordered input-info max-w-xs"
              />
            </div>

            {/*CONTACT*/}

            <div className="flex flex-col gap-5 mb-5">
              <p className="text-left text-xl mb-3 divider divider-start divider-info w-4/5">
                Contact Number
              </p>
              <input
                type="tel"
                value={contact}
                placeholder="Type your phone number"
                onChange={(e) => setContact(e.target.value)}
                className="input input-bordered input-info max-w-xs"
              />
            </div>
            {isExceedingLeave ? (
              <>
                <p>Your Leave Application limit exceeded your due Date</p>
              </>
            ) : (
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-400 dark:text-white dark:hover:bg-blue-300 dark:active:bg-blue-200"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;
