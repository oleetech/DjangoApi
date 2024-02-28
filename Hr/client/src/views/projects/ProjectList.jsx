import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import axios from "axios";
import ProjectEdit from "./ProjectEdit";
import { hoverScale } from "../../components/DesignStandardize";
import { toast } from "react-toastify";

const ProjectList = () => {
  const id = useParams();
  const [projects, setProjects] = useState([]);
  const [projectID, setProjectID] = useState(null);
  useEffect(() => {
    // Fetch all employee data when the component mounts
    const fetchProjectData = async () => {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/project/${parseInt(
          id.EmployeeID
        )}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setProjects(data.projects || []);
        });
    };

    fetchProjectData();
  }, []);

  const DeleteProject = async (id, name) => {
    if (window.confirm(`Are u sure u want to delete the project ${name}?`)) {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/project/${id}`
      );
      toast.success("Project Got Deleted Successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "my_modal_1") {
        document.getElementById("my_modal_1").close();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const [modal, setModal] = useState(false);
  const toggleEditModal = () => {
    setModal((prevShowModal) => !prevShowModal);
  };
  const editModal = (id) => {
    setProjectID(id);
    toggleEditModal();
  };

  return (
    <>
      <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto">
        <table className="min-w-full text-center text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-700">
            <tr className="sticky top-0 bg-white">
              <th className="pb-2">From</th>
              <th className="pb-2">To</th>
              <th className="pb-2">Project Name</th>
              <th className="pb-2">Technical Experience</th>
              <th className="pb-2">Managerial Experience</th>
              <th className="pb-2">Edit</th>
              <th className="pb-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 &&
              projects.map((emp) => (
                <tr key={emp.ProjectID}>
                  <td className="w-[173px] h-[64px]">{emp.From}</td>
                  <td className="w-[173px] h-[64px]">{emp.To}</td>
                  <td className="w-[173px] h-[64px]">
                    <ReactQuill
                      value={emp.Name}
                      readOnly={true}
                      theme="snow"
                      modules={{ toolbar: false }}
                    />
                  </td>
                  <td className="w-[173px] h-[64px]">
                    <ReactQuill
                      value={emp.TechnicalExperience}
                      readOnly={true}
                      theme="snow"
                      modules={{ toolbar: false }}
                    />
                  </td>
                  <td className="w-[173px] h-[64px]">
                    <ReactQuill
                      value={emp.ManagerialExperience}
                      readOnly={true}
                      theme="snow"
                      modules={{ toolbar: false }}
                    />
                  </td>
                  <td className="w-[173px] h-[64px]">
                    <EditIcon
                      className="hover:bg-blue-500 hover:text-white text-blue-500 p-[1px] rounded-xl hover:cursor-pointer"
                      onClick={() => editModal(emp.ProjectID)}
                    />
                  </td>
                  <td className="w-[173px] h-[64px]">
                    <DeleteIcon
                      className="hover:bg-red-500 hover:text-white text-red-500 p-[1px] rounded-xl hover:cursor-pointer"
                      onClick={() => DeleteProject(emp.ProjectID, emp.Name)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="z-10 fixed inset-0 flex employee-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleEditModal}
          />
          <div className="card h-max bg-white z-20 p-4 flex flex-col gap-3 my-auto">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Edit Project
              </h2>
              <CloseIcon
                onClick={toggleEditModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>

            <ProjectEdit projectID={projectID} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;
