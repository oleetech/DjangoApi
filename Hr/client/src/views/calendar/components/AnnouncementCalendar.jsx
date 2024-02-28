import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import {
  generalInput,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusUpdate from "@mui/icons-material/SecurityUpdateGood";

const AnnouncementCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const isAdminLoggedIn = window.localStorage.getItem("adminloggedIn");

  const fetchEvents = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/announcement/all`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token,
        },
      });

      const formattedEvents = response.data.outputdata.map((event) => ({
        title: event.Title,
        start: new Date(event.Date),
        description: event.Description,
        year: event.Year,
        id: event.AnnounceId,
        status: event.Status,
      }));

      setEvents(formattedEvents);
      console.log("Fetched events:", formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    // Set the selected event when an event is clicked
    setSelectedEvent(info.event);
    console.log("setSelectedEvent:", selectedEvent);
    toggleIsSelectModalOpen();
    formik.setValues({
      Title: info.event.title,
      Description: info.event.extendedProps.description,
      Status: info.event.extendedProps.status,
      // Set other fields as needed
    });
  };

  const handleDeleteEvent = async (eventId, title) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/announcement/delete/${eventId}`;
      const token = localStorage.getItem("jwtToken");
      if (window.confirm(`Are u sure u want to delete ${title} ?`)) {
        await axios.delete(apiUrl, {
          headers: {
            Authorization: token,
          },
        });
      }

      // Filter out the deleted event
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      setSelectedEvent(null); // Clear the selected event

      toast.success(`${title} Got Deleted`);
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
    Title: "",
    Description: "",
  };
  // Initialize Formik
  const formik = useFormik({
    initialValues: initialFormData,
    onSubmit: async (values) => {
      try {
        // Add logic to save edited event data to the server
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/announcement/update/${selectedEvent.id}`;
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
        toast.success("Announcement edited successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        toast.error(" Announce Edit ERROR ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });

  const [user, setUser] = useState(null);
  const userString = localStorage.getItem("user");
  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, [userString]);

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

      {/* modal for selected announcement */}
      {selectedEvent && isSelectModalOpen && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleIsSelectModalOpen}
          />
          <div className="card max-w-80 min-w-64 bg-white z-30 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Announcement
              </h2>
              <CloseIcon
                onClick={toggleIsSelectModalOpen}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>

            <div className="flex flex-col gap-3">
              <h2>
                <span className="font-semibold">Title: </span>
                {selectedEvent.title}
              </h2>
              <p>
                <p className="font-semibold">Description: </p>
                {selectedEvent.extendedProps.description}
              </p>
              <p className="font-semibold flex gap-1 items-center">
                Status:
                <div
                  className={`w-3 h-3 rounded-full mt-[2px] ${
                    selectedEvent.extendedProps.status === "Inactive"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="text-gray-300 font-normal">
                  ({selectedEvent.extendedProps.status})
                </span>
              </p>

              {isAdminLoggedIn !== null && (
                <div className="flex justify-center gap-3">
                  {/* Delete button */}
                  <div className="text-[#214DED] hover:text-red-500 hover:cursor-pointer rounded-full w-max h-max px-2 pb-[2px] hover:bg-[#414141]">
                    <DeleteIcon
                      onClick={() =>
                        handleDeleteEvent(selectedEvent.id, selectedEvent.title)
                      }
                    />
                  </div>

                  {/* Edit button */}
                  <div className="text-[#214DED] hover:cursor-pointer rounded-full w-max h-max px-2 pb-[2px] hover:bg-[#414141] hover:text-white">
                    <EditIcon onClick={handleEditEvent} />
                  </div>

                  {/* <div className="text-[#214DED] hover:text-green-500 hover:cursor-pointer rounded-full w-max h-max px-2 pb-[2px] hover:bg-[#414141]">
                    <StatusUpdate onClick={() => {}} />
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* modal to edit announcement */}
      {isEditing && showEditModal && isAdminLoggedIn !== null && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleEditModal}
          />

          <div className="card max-w-80 min-w-64 bg-white z-30 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Edit Announcement
              </h2>
              <CloseIcon
                onClick={toggleEditModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Title</label>
                    <input
                      className={`${generalInput}`}
                      type="text"
                      name="Title"
                      onChange={formik.handleChange}
                      value={formik.values.Title}
                    />
                  </div>

                  <div>
                    <label>Status</label>
                    <select
                      name="Status"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Status}
                      className={`${generalInput}`}
                    >
                      <option value="Inactive">Due</option>
                      <option value="Active">Completed</option>
                    </select>
                    {formik.touched.Status && formik.errors.Status && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.Status}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label>Description</label>
                    <input
                      className={`${generalInput}`}
                      type="text"
                      name="Description"
                      onChange={formik.handleChange}
                      value={formik.values.Description}
                    />
                  </div>

                  <div>
                    <label>Date</label>
                    <input
                      type="date"
                      className={`${generalInput}`}
                      placeholder="Enter Date..."
                      value={formik.values.Date}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                className={`mr-auto ${modalButton} ${hoverScale}`}
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

export default AnnouncementCalendar;
