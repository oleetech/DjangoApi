import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../components/DesignStandardize";
const AddProjects = ({ idProp }) => {
  const EmployeeID = useParams();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [technicalExperience, settechnicalExperience] = useState("");
  const [managerialExperience, setManagerialExperience] = useState("");
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  const handleProjectNameChange = (value) => {
    setProjectName(value);
  };

  const handleTechnicalExperienceChange = (value) => {
    settechnicalExperience(value);
  };

  const handleManagerialExperienceChange = (value) => {
    setManagerialExperience(value);
  };
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      From: from,
      To: to,
      Name: projectName,
      TechnicalExperience: technicalExperience,
      ManagerialExperience: managerialExperience,
      EmployeeID: parseInt(EmployeeID.EmployeeID) || idProp,
    };
    console.log(data);
    try {
      const response = await axios.post(`${apiUrl}/project/create`, data);

      toast.success("Project Insertion Succesful!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error("An error Occured");
      console.error("error:", err);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 max-h-96 overflow-y-auto"
    >
      {/* Dates */}
      <div className="flex flex-col lg:flex-row gap-3 text-lg">
        <div className="w-60">
          <label>From</label>
          <input
            type="date"
            value={from}
            placeholder="From"
            className={`${generalEditInputUser}`}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="w-60">
          <label>To</label>
          <input
            type="date"
            value={to}
            placeholder="To"
            className={`${generalEditInputUser}`}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`w-max h-max mr-2 mt-2 ml-auto ${modalButton} ${hoverScale}`}
        >
          Save
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-wrap gap-3">
        <div className="w-60">
          <label>Project Name</label>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={projectName}
            placeholder="Write Your Contents here..."
            onChange={handleProjectNameChange}
          />
        </div>
        <div className="w-60">
          <label>Technical Expeience</label>
          <ReactQuill
            theme="snow"
            placeholder="Write Your Contents here..."
            modules={modules}
            value={technicalExperience}
            onChange={handleTechnicalExperienceChange}
          />
        </div>
        <div className="w-60">
          <label>Managerial Experience</label>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={managerialExperience}
            placeholder="Write Your Contents here...."
            onChange={handleManagerialExperienceChange}
          />
        </div>
      </div>
    </form>
  );
};

export default AddProjects;
