import React, { useEffect, useState } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EyeCloseIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
const UpdateEmployeePassword = ({ id }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [employee, setEmployee] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [Password,setPassword] = useState("");
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/employee/${id}`);
        setEmployee(response.data.employeeInfo);
        console.log({ myemployee: response.data.employeeInfo });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [id]);
   const updatePassword = async(e)=>{
    e.preventDefault();
    try {
      const data={
        Password:Password
      }
      console.log(data);
      const response = await axios.put(`${apiUrl}/employee/UpdatePassword/${id}`,data);
      console.log(response.data);
      toast.success("Password Updated Successfully");
      setTimeout(()=>{
       window.location.reload();
      },500)
    } catch (error) {
      toast.error("There is an error");
      console.log(error);
    }
   }
  return (
    <form
      onSubmit={updatePassword}
      className="mt-2 flex flex-col items-center gap-3 "
    >
      <div className="w-40">
        <label className="text-sm md:text-base">
          Password <span className="text-red-500 my-auto font-bold">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          className={`${generalEditInputUser}`}
          placeholder="Enter Password..."
          name="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="absolute right-[23%] top-[144px] transform cursor-pointer text-black"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
        </button>
      </div>

      <button
        type="submit"
        className={`${hoverScale} ${modalButton} w-max py-2 mx-auto`}
      >
        Update Password
      </button>
    </form>
  );
};

export default UpdateEmployeePassword;
