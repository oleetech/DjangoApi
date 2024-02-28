import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import EyeIcon from "@mui/icons-material/Visibility";
import EyeCloseIcon from "@mui/icons-material/VisibilityOff";
import welcome_dTech from "../../../assets/images/welcome_dTech.png";
import buildings_icon from "../../../assets/images/buildings_icon.png";
import sitelogo from "../../../assets/images/logoSmall.png";
import airplane from "../../../assets/images/flyImages.png";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/account/api/login/`,
          values
        );

        const { token, adminID } = response.data;

        localStorage.setItem("adminID", adminID);
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("adminloggedIn", true);

        // navigate('/employee-list');
        window.location.href = "/admin/dashboard";

        // Show success toast
        toast.success("Login successful!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.error("Login failed:", error.message);

        // Set the general error message in formik status
        formik.setStatus(
          "Login failed. Please check your credentials and try again."
        );

        // Show error toast
        toast.error(
          "Login failed. Please check your credentials and try again.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-2 items-center w-full mx-auto md:mr-auto"
      onSubmit={formik.handleSubmit}
    >
      {formik.status && (
        <div className="error-message text-sm text-center p-2">
          {formik.status}
        </div>
      )}
      <h2 className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
        Admin Login
      </h2>
      <p className="font-normal">Login with Email</p>
      <div className="w-72 flex flex-col gap-2">
        <label className="text-sm md:text-base">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter admin email"
          className={`${generalEditInputUser}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
      </div>

      <div className="w-72 flex flex-col gap-2 relative">
        <label className="text-sm md:text-base">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Enter your password"
          className={`${generalEditInputUser}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        <button
          type="button"
          className="absolute right-2 bottom-3 transform cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
        </button>
      </div>

      <button
        type="submit"
        className={`${hoverScale} ${modalButton} py-2 mt-5`}
      >
        Login
      </button>
    </form>
  );
};

export default AdminLogin;
