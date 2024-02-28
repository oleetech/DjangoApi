import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  generalInput,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
const EditTodoList = (idProps) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [data, setData] = useState({
    title: "",
    description: "",
    timeFrom: "",
    timeTo: "",
    date: "",
  });

  const { title, description, timeFrom, timeTo, date } = data;
  const getToDoEmployeeInfo = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/todoEmployees/todoEmployeeInfo/${idProps.idProps}`
      );

      setData(response.data.employeeInfo);
    } catch (error) {}
  };

  useEffect(() => {
    getToDoEmployeeInfo();
  }, [idProps.idProps]);

  const updateToDoEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/todoEmployees/updateTodo/${idProps.idProps}`,
        data
      );
      console.log(response.data);
      toast.success("To Do List Updated Successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Cannot update To Do list!");
      console.log(error);
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
    <form className="flex flex-col gap-3" onSubmit={updateToDoEmployee}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          <div>
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter Name.."
              className={`${generalInput}`}
              value={title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              type="Description"
              placeholder="Enter Description..."
              className={`${generalInput}`}
              value={description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
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
              onChange={(e) => setData({ ...data, timeFrom: e.target.value })}
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="time"
              className={`${generalInput}`}
              placeholder="Enter end time..."
              value={timeTo}
              onChange={(e) => setData({ ...data, timeTo: e.target.value })}
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              className={`${generalInput}`}
              placeholder="Enter Date..."
              value={date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
              min={getCurrentDate()}
            />
          </div>
        </div>
      </div>

      <button type="submit" className={`mr-auto ${modalButton} ${hoverScale}`}>
        Save
      </button>
    </form>
  );
};

export default EditTodoList;
