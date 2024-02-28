import React, { useEffect, useState } from "react";
import {
  monthNumberToAbbreviation,
  hoverScale,
  modalButton,
  generalInput,
} from "../../../components/DesignStandardize";
import axios from "axios";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

const AddtodoAdmin = ({ id }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const myadmin = localStorage.getItem("adminID");

  useEffect(() => {
    if (myadmin) {
      setIsAdmin(myadmin);
    }
  }, []);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [date, setDate] = useState("");

  const AddtoList = async (e) => {
    e.preventDefault();
    console.log(date);
    const [year, monthNumber, day] = date?.split("-") || [];
    console.log(monthNumber);
    console.log(year);
    const month = monthNumberToAbbreviation[monthNumber];
    const data = {
      title: title,
      description: description,
      timeFrom: timeFrom,
      timeTo: timeTo,
      Date: date,
      Month: month,
      Year: year,
      Status: 0,
      EmployeeID: id,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `${apiUrl}/toDoAdmin/createToDoAdmin/${isAdmin}`,
        data
      );
      toast.success("Successfully Added Record in the list!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
      // Clear the form after successful addition
      setTitle("");
      setDescription("");
      setTimeFrom("");
      setTimeTo("");
      setDate("");
    } catch (err) {
      console.log("error:", err);
    }
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <form className="flex flex-col gap-3" onSubmit={AddtoList}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          <div>
            <label>Title</label>
            <input
              type="text"
              className={`${generalInput}`}
              placeholder="Enter Name.."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              type="Description"
              className={`${generalInput}`}
              placeholder="Enter Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label>Start Time</label>
            <input
              type="time"
              className={`${generalInput}`}
              placeholder="Enter start Time..."
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
            />
          </div>

          <div>
            <label>End Time</label>
            <input
              type="time"
              className={`${generalInput}`}
              placeholder="Enter end time..."
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
            />
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              className={`${generalInput}`}
              placeholder="Enter Date..."
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getCurrentDate()}
            />
          </div>
        </div>
      </div>

      <button type="submit" className={`mr-auto ${modalButton} ${hoverScale}`}>
        Add
      </button>
    </form>
  );
};

export default AddtodoAdmin;
