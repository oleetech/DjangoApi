import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import SaveTaskIcon from "@mui/icons-material/Beenhere";
import { hoverScale } from "../../../components/DesignStandardize";

function AddDailyTask() {
  const [user, setUser] = useState(null);

  // User Info
  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ব্যবহারকারীর তথ্য প্রাপ্ত করুন
    const userString = localStorage.getItem("user");
    if (userString) {
      // JSON স্ট্রিং পার্স করে ব্যবহারকারী অবজেক্ট প্রাপ্ত করুন
      const userObject = JSON.parse(userString);
      // ব্যবহারকারী স্টেট সেট করুন
      setUser(userObject);
      formik.setValues({
        ...formik.values,
        EmployeeID: userObject.employeeID || "", // Set the EmployeeID from userObject or an empty string if it's not available
      });
    }
  }, []); // এই ইফেক্টটি শুধুমাত্র মাউন্ট হতে একবার চলবে

  const formik = useFormik({
    initialValues: {
      EmployeeID: user ? user.employeeID : "", // Replace with the actual EmployeeID

      Date: new Date().toISOString().split("T")[0], // Replace with the date you want to update
      Daily_Task1: "",
      Daily_Task2: "",
      Daily_Task3: "",
      Daily_Task4: "",
      Late_Task: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/updatetask`;
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(apiUrl, values, {
          headers: {
            Authorization: `${token}`,
          },
        });

        // console.log("Task added successfully:", response.data, values);
        toast.success("Task added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          window.location.reload();
        }, 500);

        resetForm();
      } catch (error) {
        console.log("Updated failed:", error.response, values);
        formik.setStatus(
          "Updated failed. Please check your input and try again."
        );
        toast.error("Updated failed. Please check your input and try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });

  return (
    <>
      <p className="mt-1">Record your daily tasks here...</p>

      {/* {formik.status} */}
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-1 z-0">
        <table className="w-full text-black">
          <thead>
            <tr className="border-solid border-2 md:sticky md:top-0 z-0 bg-white font-bold text-center">
              <th className="py-2">Time</th>
              <th className="py-2">Daily Task</th>
            </tr>
          </thead>
          <tbody className="border-2 border-solid">
            <tr className="">
              <td className="">
                10:15 a.m to <br /> 12:15 p.m
              </td>
              <td className="  ">
                <textarea
                  label="Task 1"
                  id="Daily_Task1"
                  name="Daily_Task1"
                  type="text"
                  value={formik.values.Daily_Task1}
                  onChange={formik.handleChange}
                  className="w-full min-h-16"
                />
              </td>
            </tr>

            <tr>
              <td className="">
                12:15 p.m to <br /> 2:15 p.m
              </td>
              <td className=" ">
                <textarea
                  label="Task 2"
                  id="Daily_Task2"
                  name="Daily_Task2"
                  type="text"
                  value={formik.values.Daily_Task2}
                  onChange={formik.handleChange}
                  className="w-full min-h-16"
                />
              </td>
            </tr>

            <tr>
              <td>
                2:15 p.m to <br /> 4:15 p.m
              </td>
              <td className=" ">
                <textarea
                  label="Task 3"
                  id="Daily_Task3"
                  name="Daily_Task3"
                  type="text"
                  value={formik.values.Daily_Task3}
                  onChange={formik.handleChange}
                  className="w-full min-h-16"
                />
              </td>
            </tr>

            <tr>
              <td>
                4:15 p.m to <br /> 6:15 p.m
              </td>
              <td className="my-auto">
                <textarea
                  label="Task 4"
                  id="Daily_Task4"
                  name="Daily_Task4"
                  type="text"
                  value={formik.values.Daily_Task4}
                  onChange={formik.handleChange}
                  className="w-full min-h-16"
                />
              </td>
            </tr>

            <tr>
              <td className="">Late Task</td>
              <td className="">
                <textarea
                  label="Late Task"
                  id="Late_Task"
                  name="Late_Task"
                  type="text"
                  value={formik.values.Late_Task}
                  onChange={formik.handleChange}
                  className="w-full min-h-16"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          className={`ml-auto p-1 text-white border rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
        >
          <SaveTaskIcon fontSize="1px" /> Save Task
        </button>
      </form>
    </>
  );
}

export default AddDailyTask;
