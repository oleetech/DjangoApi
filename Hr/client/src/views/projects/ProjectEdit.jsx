import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../components/DesignStandardize";

const ProjectEdit = ({ projectID }) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [data, setData] = useState({
    From: "",
    To: "",
    Name: "",
    TechnicalExperience: "",
    ManagerialExperience: "",
  });
  const fetchProjectData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/project/${projectID}`);
      const initialData = response.data.projects[0];
      setData({
        From: initialData.From,
        To: initialData.To,
        Name: initialData.Name,
        TechnicalExperience: initialData.TechnicalExperience,
        ManagerialExperience: initialData.ManagerialExperience,
      });
    } catch (error) {
      console.log("Error fetching customer:", error);
    }
  };
  useEffect(() => {
    fetchProjectData();
  }, [projectID]);

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
  const updateProjects = async (e) => {
    try {
      e.preventDefault();
      console.log(data);
      await axios.put(`${apiUrl}/project/${projectID}`, data).then((res) => {});
      toast.success("Project Info Updated Successfully!!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Project Info Update Failed!!!");
    }
  };

  return (
    <form
      onSubmit={updateProjects}
      className="flex flex-col gap-10 max-h-96 overflow-y-auto"
    >
      {/* Dates */}
      <div className="flex flex-col lg:flex-row gap-3 text-lg">
        <div className="w-60">
          <label>From</label>
          <input
            type="date"
            value={data.From}
            placeholder="From"
            className={`${generalEditInputUser}`}
            onChange={(e) => setData({ ...data, From: e.target.value })}
          />
        </div>
        <div className="w-60">
          <label>To</label>
          <input
            type="date"
            value={data.To}
            placeholder="To"
            className={`${generalEditInputUser}`}
            onChange={(e) => setData({ ...data, To: e.target.value })}
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
            value={data.Name}
            placeholder="Write Your Contents here..."
            onChange={(value) => setData({ ...data, Name: value })}
          />
        </div>
        <div className="w-60">
          <label>Technical Expeience</label>
          <ReactQuill
            theme="snow"
            placeholder="Write Your Contents here..."
            modules={modules}
            value={data.TechnicalExperience}
            onChange={(value) =>
              setData({ ...data, TechnicalExperience: value })
            }
          />
        </div>
        <div className="w-60">
          <label>Managerial Experience</label>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={data.ManagerialExperience}
            placeholder="Write Your Contents here...."
            onChange={(value) =>
              setData({ ...data, ManagerialExperience: value })
            }
          />
        </div>
      </div>
    </form>
  );
};

export default ProjectEdit;
