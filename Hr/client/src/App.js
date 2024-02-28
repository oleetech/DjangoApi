import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./views/login/Login";
import AdminReg from "./views/admin/AdminReg";
import EmployeeIndividualList from "./views/dashboard/componentsAD/EmployeeIndividualList";
import UserLeave from "./Leave/user/UserLeave";
import AdminLeave from "./Leave/admin/AdminLeave";
import MyCalendar from "./views/calendar/MyCalendar";
import Pending from "./Leave/admin/components/Pending";
import UserDashboard from "./views/dashboard/UserDashboard";
import AdminDashboard from "./views/dashboard/AdminDashboard";
import GetToDoListDateUser from "./views/TodoList/employee/GetToDoListDateUser";
import GetToDoListDateAdmin from "./views/TodoList/admin/GetToDoListDateAdmin";

function App() {
  const isUserLoggedIn = window.localStorage.getItem("user");
  let employeeID = null;
  if (isUserLoggedIn) {
    const userObject = JSON.parse(isUserLoggedIn);
    employeeID = userObject.employeeID;
  }
  // console.log("user:", isUserLoggedIn);

  const isAdminLoggedIn = window.localStorage.getItem("adminloggedIn");
  let adminID = null;
  if (isAdminLoggedIn) {
    const adminObject = JSON.parse(isAdminLoggedIn);
    adminID = adminObject.adminID;
  }
  // console.log("admin:", isAdminLoggedIn);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin-reg" element={<AdminReg />} />

          <Route path="/" element={<Login />} />

          {isAdminLoggedIn !== null && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/:Name/:EmployeeID"
                element={<EmployeeIndividualList />}
              />
              <Route path="/admin/calendar" element={<MyCalendar />} />
              <Route path="/admin/leave-application" element={<AdminLeave />} />
              <Route
                path="/admin/todo"
                element={<GetToDoListDateAdmin id={adminID} todo={true} />}
              />
            </>
          )}

          {isUserLoggedIn !== null && (
            <>
              <Route path="/employee/dashboard" element={<UserDashboard />} />
              <Route path="/employee/calendar" element={<MyCalendar />} />
              <Route
                path="/employee/leave-application"
                element={<UserLeave />}
              />
              <Route
                path="/employee/todo"
                element={
                  <GetToDoListDateUser
                    id={employeeID}
                    todo={true}
                    isAdmin={false}
                  />
                }
              />
            </>
          )}

          <Route path="/pending/:EpmloyeeID" element={<Pending />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
