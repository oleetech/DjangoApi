import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import {
  generalEditInputUser,
  hoverScale,
  modalButton,
} from "../../../components/DesignStandardize";

const UpdateAdminForm = () => {
  const [admin, setAdmin] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const adminID = localStorage.getItem("adminID");
  useEffect(() => {
    // Fetch admin data based on adminID
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/${adminID}`);
        setAdmin(response.data.admin);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [adminID]);

  const formik = useFormik({
    initialValues: {
      username: admin?.username || "",
      email: admin?.email || "",
      password: "",
      image: null,
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        for (const key in values) {
          formData.append(key, values[key]);
        }

        await axios.put(
          `${apiUrl}/admin/updateAdminWithImage/${adminID}`,
          formData
        );
        toast.success("Admin updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error updating admin:", error);
      }
    },
  });

  // Set form values when admin data is fetched
  useEffect(() => {
    if (admin) {
      formik.setValues({
        username: admin.username || "",
        email: admin.email || "",
        password: "",
        image: null,
      });
    }
  }, [admin]);

  return (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-3">
      <div className="w-20 md:w-40">
        <label className="text-sm md:text-base">Name</label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
          className={`${generalEditInputUser}`}
        />
      </div>

      <div className="w-20 md:w-40">
        <label className="text-sm md:text-base">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className={`${generalEditInputUser}`}
        />
      </div>

      <div className="w-20 md:w-40">
        <label className="text-sm md:text-base">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className={`${generalEditInputUser}`}
        />
      </div>

      <div className="w-20 md:w-40">
        <label className="text-sm md:text-base">Image</label>
        <input
          id="image"
          name="image"
          type="file"
          className={`${generalEditInputUser}`}
          onChange={(event) =>
            formik.setFieldValue("image", event.target.files[0])
          }
        />
      </div>

      <button
        type="submit"
        className={`${hoverScale} ${modalButton} w-max mr-auto`}
      >
        Update Admin
      </button>
    </form>
  );
};

export default UpdateAdminForm;
