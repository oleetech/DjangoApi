import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import {
  generalInput,
  hoverScale,
  modalButton,
  monthNumberToAbbreviation,
} from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
const EditLeaveApplication = ({ id }) => {
  console.log("Edit LeaveID:", id);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDates, setTotalDates] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
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
    setSelectedDates(datesArray);
    console.log(datesArray);
    // Convert selectedDates to ISO 8601 format with Bangladesh Standard Time (GMT+6) offset
    const isoDatesArray = datesArray.map((date) =>
      moment(date).tz("Asia/Dhaka").format()
    );
    console.log(isoDatesArray);
    setData({
      ...data,
      Date: JSON.stringify(isoDatesArray),
      Total: newTotalDates,
    });
  };

  // Calculate remaining leave days (Due)
  const [data, setData] = useState({
    DateApplied: "",
    Address: "",
    Contact: "",
    Cause: "",
  });

  const { DateApplied, Address, Contact, Cause } = data;
  console.log(data);
  //   console.log(data.totalDates);
  const getMonthName = () => {
    const [day, month, year] = DateApplied.split("-") || [];
    const Months = monthNumberToAbbreviation[month];
    console.log(Months);
    return Months;
  };
  data.Month = getMonthName();
  console.log(data.Month);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getIndividualApplicationInfo = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/leave/detailsByLeaveID/${id}`
      );
      console.log(response.data);
      setData(response.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getIndividualApplicationInfo();
  }, [id]);
  const updateLeaveApplication = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/leave/updateLeave/${id}`,
        data
      );
      console.log(response.data);
      toast.success("Leave Application Updated Successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.success("Oops! There is an error in updating");
      console.log(error);
    }
  };
  return (
    <>
      <form
        onSubmit={updateLeaveApplication}
        className="flex flex-col gap-3 items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          <div className="justify-items-center">
            <p className="text-blue-900 text-lg">Dates for Leave</p>
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              filterDate={isWeekday}
              dateFormat="yyyy-MM-dd"
              showTimeSelect={false}
              // className="w-[50px]"
              //monthsShown={2}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label>Date Applied</label>
              <input
                type="date"
                //   placeholder="Enter Name.."
                className={`${generalInput}`}
                value={DateApplied}
                onChange={(e) =>
                  setData({ ...data, DateApplied: e.target.value })
                }
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter Address.."
                className={`${generalInput}`}
                value={Address}
                onChange={(e) => setData({ ...data, Address: e.target.value })}
              />
            </div>
            <div>
              <label>Contact</label>
              <input
                type="text"
                placeholder="Enter Contact.."
                className={`${generalInput}`}
                value={Contact}
                onChange={(e) => setData({ ...data, Contact: e.target.value })}
              />
            </div>
            <div>
              <label>Cause</label>
              <textarea
                type="text"
                placeholder="Enter Cause.."
                className={`${generalInput}`}
                value={Cause}
                onChange={(e) => setData({ ...data, Cause: e.target.value })}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`${modalButton} ${hoverScale} py-2 mx-auto w-max m-2`}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default EditLeaveApplication;
