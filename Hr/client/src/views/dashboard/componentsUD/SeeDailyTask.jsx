import axios from "axios";
import React, { useEffect, useState } from "react";

const SeeDailyTask = () => {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState(null);

  const getTask = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/employeeTask/${user.employeeID}`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTask(response.data.attendances);
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTask();
    }
  }, [user]);

  return (
    <>
      <p className="mt-1 z-0">See your today's task here...</p>

      <div className="max-h-96 max-w-96 sm:max-w-full overflow-auto">
        <table className="table text-center overflow-x-auto z-0">
          <thead>
            <tr className="md:sticky md:top-0 bg-white">
              <th>Date</th>
              <th className="text-center">
                10:15 a.m to <br /> 12:15 p.m
              </th>
              <th className="text-center">
                12:15 p.m to <br /> 2:15 p.m
              </th>
              <th className="text-center">
                2:15 p.m to <br /> 4:15 p.m
              </th>
              <th className="text-center">
                4:15 p.m to <br /> 6:15 p.m
              </th>
              <th> Late Task</th>
            </tr>
          </thead>

          <tbody>
            {task &&
              task.map((entry, index) => {
                if (index === 0 || entry.Date !== task[index - 1].Date) {
                  return (
                    <tr key={index}>
                      <td>{entry.Date && entry.Date}</td>
                      <td>{entry.Daily_Task1 && entry.Daily_Task1}</td>
                      <td>{entry.Daily_Task2 && entry.Daily_Task2}</td>
                      <td>{entry.Daily_Task3 && entry.Daily_Task3}</td>
                      <td>{entry.Daily_Task4 && entry.Daily_Task4}</td>
                      <td>{entry.Late_Task && entry.Late_Task}</td>
                    </tr>
                  );
                } else {
                  return null; // Skip rendering for duplicate dates
                }
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SeeDailyTask;
