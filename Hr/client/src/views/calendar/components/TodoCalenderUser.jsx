import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  generalInput,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusUpdate from "@mui/icons-material/SecurityUpdateGood";

const TodoCalenderUser = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(null);

  const [user, setUser] = useState(null);
  const userString = localStorage.getItem("user");

  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
      setId(userObject.EmployeeID);
    }
  }, [userString]);

  const fetchEvents = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/todoEmployees/todobyEmployeeID/${user.employeeID}`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token,
        },
      });

      const formattedEvents = response.data.todo.map((event) => ({
        title: event.title,
        start: new Date(event.Date),
        description: event.description,
        year: event.Year,
        id: event.TodoEmployeeID,
        status: event.Status,
      }));

      setEvents(formattedEvents);
      console.log("Events:", events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setId(user.employeeID);
    }
    fetchEvents();
  }, [user]);

  const handleEventClick = (info) => {
    // Set the selected event when an event is clicked
    setSelectedEvent(info.event);

    toggleIsSelectModalOpen();
    formik.setValues({
      title: info.event.title,
      description: info.event.extendedProps.description,
      // status: info.event.extendedProps.Status,
      // Set other fields as needed
    });
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/todoEmployees/deleteTodo/${eventId}`;
      const token = localStorage.getItem("jwtToken");
      await axios.delete(apiUrl, {
        headers: {
          Authorization: token,
        },
      });

      // Filter out the deleted event
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      setSelectedEvent(null); // Clear the selected event
      toast.success(" Todo edited successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = () => {
    setIsEditing(true);
    toggleEditModal();
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const toggleEditModal = (id) => {
    setShowEditModal((prevShowEditModal) => !prevShowEditModal);
  };

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const toggleIsSelectModalOpen = () => {
    setIsSelectModalOpen((prevShowModal) => !prevShowModal);
  };

  // Define initial form data
  const initialFormData = {
    title: "",
    description: "",
  };
  // Initialize Formik
  const formik = useFormik({
    initialValues: initialFormData,
    onSubmit: async (values) => {
      try {
        // Add logic to save edited event data to the server
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/todoEmployees/updateToDo/${selectedEvent.id}`;
        const token = localStorage.getItem("jwtToken");
        await axios.put(apiUrl, values, {
          headers: {
            Authorization: token,
          },
        });

        // Update events with edited data
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? { ...event, ...values } : event
          )
        );

        // Hide the edit form
        setIsEditing(false);
        toast.success(" Todo edited successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error editing event:", error);
        toast.error(" Todo Edit ERROR ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [status, setStatus] = useState(true);
  // const changeStatus = async (selectedID, currentStatus) => {
  //   try {
  //     const data = {
  //       Status: currentStatus === 0 ? 1 : 0, // Toggle the status
  //     };
  //     const response = await axios.put(
  //       `${apiUrl}/todoEmployees/updateTodoStatus/${selectedID}`,
  //       data
  //     );
  //     console.log(response.data);
  //     getData(); // Refresh the data after updating status
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  console.log("selectedEvents:", selectedEvent);
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="pb-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        views={{
          month: { type: "dayGridMonth", buttonText: "Month" },
          year: { type: "dayGridYear", buttonText: "Year" },
        }}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,dayGridYear",
        }}
        weekends={true}
        events={events}
        eventClick={handleEventClick}
      />

      {selectedEvent && isSelectModalOpen && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleIsSelectModalOpen}
          />
          <div className="card max-w-80 min-w-64 bg-white z-30 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                To-Do
              </h2>
              <CloseIcon
                onClick={toggleIsSelectModalOpen}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <div className="flex flex-col gap-3">
              <h2>
                <span className="font-semibold">Title:</span>{" "}
                {selectedEvent.title}
              </h2>
              <p>
                <p className="font-semibold">Description:</p>{" "}
                {selectedEvent.extendedProps.description}
              </p>
              {/* <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedEvent.extendedProps.status}
              </p> */}

              <div className="flex justify-center gap-3">
                {/* Delete button */}
                <div className="text-[#214DED] hover:text-red-500 hover:cursor-pointer rounded-full w-max h-max px-2 pb-[2px] hover:bg-[#414141]">
                  <DeleteIcon
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  />
                </div>

                {/* Edit button */}
                <div className="text-[#214DED] hover:cursor-pointer rounded-full w-max h-max px-2 pb-[2px] hover:bg-[#414141] hover:text-white">
                  <EditIcon onClick={handleEditEvent} />
                </div>

                {/* <div className="text-[#214DED] hover:text-green-500 hover:cursor-pointer rounded-full w-max h-max px-2 pb-[2px] hover:bg-[#414141]">
                  <StatusUpdate
                    onClick={() => {
                      setStatus(!status);
                      
                    }}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && showEditModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleEditModal}
          />
          <div className="card max-w-80 min-w-64 bg-white z-30 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Edit To-Do
              </h2>
              <CloseIcon
                onClick={toggleEditModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Title</label>
                    <input
                      className={`${generalInput}`}
                      type="text"
                      name="title"
                      onChange={formik.handleChange}
                      value={formik.values.title}
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <input
                      className={`${generalInput}`}
                      type="text"
                      name="description"
                      onChange={formik.handleChange}
                      value={formik.values.description}
                    />
                    {/* Add other fields as needed */}
                    <br />
                  </div>
                </div>

                {/* date needs to be checked */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Date</label>
                    <input
                      type="date"
                      className={`${generalInput}`}
                      placeholder="Enter Date..."
                      value={formik.values.Date}
                      onChange={formik.handleChange}
                      min={getCurrentDate()}
                    />
                  </div>
                  <div>
                    <label>Status</label>
                    <select
                      name="Status"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Status}
                      className="input input-bordered input-info w-full max-w-xs"
                    >
                      <option value="0">Inactive</option>
                      <option value="1">Active</option>
                    </select>
                    {formik.touched.Status && formik.errors.Status && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.Status}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className={`${modalButton} ${hoverScale}`}
                onClick={formik.handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCalenderUser;
