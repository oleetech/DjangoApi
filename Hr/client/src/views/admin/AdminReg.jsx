import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { generalInput } from "../../components/DesignStandardize";

const AdminReg = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const validationSchema = Yup.object({
    username: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      usernamename: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitted(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/register`,
          values
        );
        toast.success(" সফলভাবে  করা হয়েছে!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("User created successfully:", response.data);
        window.location.href = "/";
      } catch (error) {
        toast.error("Error creating user", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });
  return (
    <div className="h-screen flex flex-col gap-3 items-center my-auto py-10">
      <h2 className="text-[28px] text-transparent bg-clip-text bg-gradient-to-b from-[#214DED] to-[#B92F2C] md:font-extrabold font-bold">
        Admin Registration
      </h2>
      <div className="bg-white p-4 w-1/2 h-max rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group basic">
            <div className="input-wrapper">
              <label className="label" htmlFor="username">
                Name
              </label>
              <input
                type="text"
                AddtodoUseclassName={`${generalInput}`}
                id="username"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder="Enter a name"
              />
              {isSubmitted && formik.touched.name && formik.errors.username && (
                <div className="error-message">{formik.errors.username}</div>
              )}
            </div>
          </div>

          <div className="form-group basic">
            <div className="input-wrapper">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                AddtodoUseclassName={`${generalInput}`}
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="Enter an Email"
              />
              {isSubmitted && formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}
            </div>
          </div>

          <div className="form-group basic">
            <div className="input-wrapper">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                AddtodoUseclassName={`${generalInput}`}
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter a Password"
              />
              {isSubmitted &&
                formik.touched.password &&
                formik.errors.password && (
                  <div className="error-message">{formik.errors.password}</div>
                )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-outline-primary rounded shadowed me-1 mb-1"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReg;
