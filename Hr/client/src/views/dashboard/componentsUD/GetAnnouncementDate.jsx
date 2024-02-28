import axios from "axios";
import React, { useState, useEffect } from "react";
import CollapsibleContent from "../../../components/CollapsibleContent";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { hoverScale } from "../../../components/DesignStandardize";
import AddAnnounce from "../../calendar/components/AddAnnounce";
import EditIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusUpdate from "@mui/icons-material/SecurityUpdateGood";
import { toast } from "react-toastify";

const GetAnnouncementDate = () => {
  const [date, setDate] = useState("");
  const [announcementData, setAnnouncementData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [openSection, setOpenSection] = useState(null);
  const isAdminLoggedIn = window.localStorage.getItem("adminloggedIn");
  const [events, setEvents] = useState([]);

  const handleToggle = (index) => {
    setOpenSection((prevIndex) => (prevIndex === index ? null : index));
  };

  const getData = async () => {
    try {
      console.log(date);
      if (!date) {
        console.log("Date is Undefined");
        return;
      }
      const response = await axios.get(`${apiUrl}/announcement/date/${date}`);
      console.log(response.data.outputdata);
      setAnnouncementData(response.data.outputdata || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (date) {
      getData();
    }
  }, [date]);
  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Format the date to YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split("T")[0];

    // Set the formatted date in the state
    setDate(formattedDate);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const toggleAddModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
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

      toast.error(`To-Do ${title} Got Deleted!`);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-[320px] h-96">
        <div className="flex items-center justify-between">
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] m-0 font-semibold">
            Announcements
          </p>
          {isAdminLoggedIn !== null && (
            <AddIcon
              className="hover:cursor-pointer rounded-full p-[1px] hover:bg-[#414141] hover:text-white"
              onClick={toggleAddModal}
            />
          )}
        </div>
        <input
          type="date"
          className="border-2 boder-black py-1 px-2 rounded-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex flex-col gap-1 overflow-y-auto">
          {announcementData.map((items, index) => {
            return (
              <div key={index} className="">
                <CollapsibleContent
                  card
                  title={items.Title}
                  onToggle={() => handleToggle(index)}
                  isOpen={openSection === index}
                >
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-semibold">Description:</p>
                      <h3 className="text-balance ...">{items.Description}</h3>
                    </div>
                    <p>
                      <span className="font-semibold">Date:</span> {items.Date}
                    </p>
                    <div className="flex justify-between">
                      <p className="font-semibold flex gap-1 items-center">
                        Status:
                        <div
                          className={`w-3 h-3 rounded-full mt-[2px] ${
                            items.Status === "Inactive"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        />
                        <span className="text-gray-300 font-normal">
                          ({items.Status === "Inactive" ? "Due" : "Complete"})
                        </span>
                      </p>

                      {isAdminLoggedIn !== null && (
                        <div className="flex justify-center">
                          {/* Delete button */}
                          <div className="text-[#214DED] hover:text-red-500 hover:cursor-pointer rounded-full w-max h-max px-1 pb-[2px] hover:bg-[#414141]">
                            <DeleteIcon
                              fontSize="1px"
                              onClick={() =>
                                handleDeleteEvent(items.AnnounceId, items.Title)
                              }
                            />
                          </div>

                          {/* Edit button */}
                          <div className="text-[#214DED] hover:cursor-pointer rounded-full w-max h-max px-1 pb-[2px] hover:bg-[#414141] hover:text-white">
                            <EditIcon fontSize="1px" onClick={() => {}} />
                          </div>

                          <div className="text-[#214DED] hover:text-green-500 hover:cursor-pointer rounded-full w-max h-max px-1 pb-[2px] hover:bg-[#414141]">
                            <StatusUpdate fontSize="1px" onClick={() => {}} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add new announcement */}
      {showModal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleAddModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add Announcement
              </h2>
              <CloseIcon
                onClick={toggleAddModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <AddAnnounce />
          </div>
        </div>
      )}
    </>
  );
};

export default GetAnnouncementDate;
