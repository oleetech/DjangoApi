import axios from "axios";
import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import CollapsibleContent from "../../../components/CollapsibleContent";
import CloseIcon from "@mui/icons-material/Close";
import { hoverScale } from "../../../components/DesignStandardize";
import AddtodoAdmin from "./AddtodoAdmin";
import EditTodoListAdmin from "./EditTodoListAdmin";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import PageTitle from "../../../components/PageTitle";

const GetToDoListDateAdmin = ({ id, myCalendar, todo }) => {
  const [date, setDate] = useState("");
  const [todoData, setTodoData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [openSection, setOpenSection] = useState(null);
  const [selectedTodoEmployeeID, setSelectedTodoEmployeeID] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toggleAddModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const toggleEditModal = (id) => {
    setShowEditModal((prevShowEditModal) => !prevShowEditModal);
  };

  const handleToggle = (index) => {
    setOpenSection((prevIndex) => (prevIndex === index ? null : index));
  };

  const getData = async () => {
    try {
      if (!date) {
        console.log("Date is Undefined");
        return;
      }
      const encodedDate = encodeURIComponent(date);

      const response = await axios.get(
        `${apiUrl}/toDoAdmin/dailyToDoAdmin/${id}/${encodedDate}`
      );
      setTodoData(response.data.todo || []);
      // console.log("settododata:", todoData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (date) {
      getData();
    }
  }, [id, date]);
  const [status, setStatus] = useState(false);
  const changeStatus = async (selectedID, currentStatus) => {
    try {
      const data = {
        Status: currentStatus === 0 ? 1 : 0, // Toggle the status
      };
      const response = await axios.put(
        `${apiUrl}/toDoAdmin/updateToDoAdminStatus/${selectedID}`,
        data
      );

      getData(); // Refresh the data after updating status
      toast.success(`Status Updated Successfully!`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodoTask = async (id, title) => {
    if (window.confirm(`Are u sure u want to delete ${title} ?`)) {
      const response = await axios.delete(
        `${apiUrl}/toDoAdmin/deleteToDoAdmin/${id}`
      );
      toast.error(`To-Do ${title} Got Deleted!`);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setDate(formattedDate);
  }, []);

  return (
    <>
      {todo === true && (
        <>
          <Navbar />
          <PageTitle title="My To-Do..." />
        </>
      )}
      <div
        className={`flex flex-col gap-3 ${
          myCalendar === true && "w-full md:w-[290px]"
        } ${
          todo === true && "w-full mt-2 md:mt-0 md:pt-20 px-2 md:pl-20"
        } w-[290px]`}
      >
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] m-0 font-semibold">
              To-Do List
            </p>

            <AddIcon
              className="hover:cursor-pointer rounded-full p-[1px] hover:bg-[#414141] hover:text-white"
              onClick={toggleAddModal}
            />
          </div>
          <input
            type="date"
            className="border-2 boder-black py-1 px-2 rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {showModal && myCalendar === true && (
          <div className="border-2 border-solid card bg-white z-30 p-4 modal-white flex flex-col gap-3 my-auto">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add To-Do
              </h2>
              <CloseIcon
                onClick={toggleAddModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <AddtodoAdmin id={id} />
          </div>
        )}

        <div className="flex flex-col gap-1 max-h-fit overflow-y-auto">
          {todoData.map((items, index) => {
            return (
              <div key={index}>
                <CollapsibleContent
                  card
                  title={items.title}
                  onToggle={() => handleToggle(index)}
                  isOpen={openSection === index}
                  status={items.Status}
                >
                  {myCalendar === true && showEditModal && (
                    <div className="border-2 border-solid card bg-white z-30 p-4 flex flex-col gap-3 mb-5">
                      <div className="card-title flex justify-between">
                        <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                          Edit {items.title}
                        </h2>
                        <CloseIcon
                          onClick={toggleEditModal}
                          fontSize="1px"
                          className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
                        />
                      </div>
                      <EditTodoListAdmin idProps={items.TodoAdminID} />
                    </div>
                  )}

                  <div className="flex flex-col gap-3 mr-auto mt-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                          <p className="font-semibold">Description:</p>
                          <div className="flex gap-1">
                            <div
                              onClick={() => {
                                setStatus(!status);
                                changeStatus(
                                  items.TodoAdminID,
                                  items.Status ? 1 : 0
                                );
                              }}
                              className={`w-3 h-3 hover:cursor-pointer ${hoverScale} my-auto rounded-full mr-2 ${
                                !items.Status ? "bg-red-500" : "bg-green-500"
                              }`}
                            />

                            <div className="text-[#214DED] hover:cursor-pointer rounded-full w-max h-max px-1 pb-[2px] hover:bg-[#414141] hover:text-white">
                              <EditIcon
                                fontSize="1px"
                                onClick={() => {
                                  setSelectedTodoEmployeeID(items.TodoAdminID);
                                  toggleEditModal();
                                }}
                              />
                            </div>
                            <div className="text-[#214DED] hover:text-red-500 hover:cursor-pointer rounded-full w-max h-max px-1 pb-[2px] hover:bg-[#414141]">
                              <DeleteIcon
                                fontSize="1px"
                                onClick={() => {
                                  deleteTodoTask(
                                    items.TodoAdminID,
                                    items.title
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="m-0 text-black">{items.description}</p>
                      </div>

                      <div className="flex gap-1">
                        <p className="font-semibold">Date: </p>
                        <p className="m-0 text-black">{items.Date}</p>
                      </div>

                      <div className="flex gap-1">
                        <p className="font-semibold">Starts:</p>
                        <p className="font-semibold">{items.timeFrom}</p>
                      </div>

                      <div className="flex gap-1">
                        <p className="font-semibold">Ends:</p>
                        <p className="font-semibold">{items.timeTo}</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            );
          })}
        </div>

        {showModal && myCalendar === false && (
          <div className="z-10 fixed inset-0 flex items-center justify-center">
            <div
              className="bg-black bg-opacity-50 fixed inset-0"
              onClick={toggleAddModal}
            />
            <div className="card bg-white z-30 p-4 modal-white flex flex-col gap-3 my-auto">
              <div className="card-title flex justify-between">
                <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                  Add To-Do
                </h2>
                <CloseIcon
                  onClick={toggleAddModal}
                  fontSize="1px"
                  className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
                />
              </div>
              <AddtodoAdmin id={id} />
            </div>
          </div>
        )}

        {showEditModal && myCalendar === false && (
          <div className="z-10 fixed inset-0 flex items-center justify-center">
            <div
              className="bg-black bg-opacity-50 fixed inset-0"
              onClick={toggleEditModal}
            />
            <div className="card bg-white z-30 p-4 modal-white flex flex-col gap-3 my-auto">
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
              <EditTodoListAdmin idProps={selectedTodoEmployeeID} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GetToDoListDateAdmin;
