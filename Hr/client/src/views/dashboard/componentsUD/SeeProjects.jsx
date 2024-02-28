import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { hoverScale } from "../../../components/DesignStandardize";
import AddProjects from "../../projects/AddProjects";
import CloseIcon from "@mui/icons-material/CloseOutlined";

const SeeProjects = ({ idProp, isAdmin }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    // Fetch all employee data when the component mounts
    const fetchProjectData = async () => {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/project/${parseInt(idProp)}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "Project data:");
          setProjects(data.projects || []);
        });
    };

    fetchProjectData();
  }, []);

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal((prevShowModal) => !prevShowModal);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {isAdmin === false && (
          <>
            <p className="mt-1">See your assigned projects here...</p>

            <button
              className={`mr-auto w-mac py-1 px-2 text-white border rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
              onClick={toggleModal}
            >
              Add Project
            </button>
          </>
        )}

        <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto">
          <table className="min-w-full text-center text-sm">
            <thead className="border-b border-solid">
              <tr className="md:sticky md:top-0 bg-white">
                <th className="pb-2">From</th>
                <th className="pb-2">To</th>
                <th className="pb-2">Project Name</th>
                <th className="pb-2">Technical Experience</th>
                <th className="pb-2">Managerial Experience</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map((emp) => (
                  <tr
                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                    key={emp.ProjectID}
                  >
                    <td className="w-[173px] h-[64px] border-l-2 border-solid">
                      {emp.From}
                    </td>
                    <td className="w-[173px] h-[64px] border-l-2 border-solid">
                      {emp.To}
                    </td>
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
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="z-10 fixed inset-0 flex employee-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleModal}
          />
          <div className="card h-max bg-white z-20 p-4 flex flex-col gap-3 my-auto">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Add Project
              </h2>
              <CloseIcon
                onClick={toggleModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            <AddProjects idProp={idProp} />
          </div>
        </div>
      )}
    </>
  );
};

export default SeeProjects;
