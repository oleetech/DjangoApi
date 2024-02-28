import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import profileDefault from "../assets/images/profile.png";
import EditIcon from "@mui/icons-material/BorderColor";
import { hoverScale } from "./DesignStandardize";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import UpdateEmployee from "../views/dashboard/componentsAD/UpdateEmployee";

const EmployeeDetails = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const getUserInfo = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/employee/${user.employeeID}`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setProfile(response.data.employeeInfo);
      console.log({ profileInfo: response.data.employeeInfo });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleOutsideClick = (event) => {
    const isOutsideClick = !containerRef.current.contains(event.target);
    if (isOutsideClick && isClicked) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isClicked]);

  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected file:", selectedFile);
  };

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal((prevShowModal) => !prevShowModal);
  };
  return (
    <>
      <div
        className="relative inline-block m-auto"
        onClick={handleClick}
        ref={containerRef}
      >
        {profile ? (
          <img
            className={`w-8 h-8 hover:cursor-pointer hover:shadow-lg rounded-full ${hoverScale} ${
              isClicked ? "cursor-pointer" : ""
            }`}
            src={`${apiurl}/uploads/${profile.Image}`}
            alt="Profile"
          />
        ) : (
          <img
            className={`w-8 hover:cursor-pointer hover:shadow-lg rounded-full ${hoverScale} ${
              isClicked ? "cursor-pointer" : ""
            }`}
            src={profileDefault}
            alt="Profile"
          />
        )}

        {isClicked && (
          <div className={`absolute md:top-16 right-0 z-10`}>
            {/* For user */}
            {user && profile && (
              <div className="shadow-lg text-left w-max bg-blue-50 p-2 flex flex-row flex-wrap items-center gap-3 rounded-lg md:ml-[40px] md:-mt-6 ml-0 -mt-0">
                <div className="flex flex-row gap-2 justify-between w-full">
                  <img
                    className={`w-16 h-16 mb-auto rounded-full`}
                    src={`${apiurl}/uploads/${profile.Image}`}
                    alt="Profile"
                    style={{ filter: isHovered ? "brightness(70%)" : "none" }}
                  />
                  <div
                    className={`mb-auto hover:cursor-pointer flex items-center justify-center rounded-full text-black ${hoverScale}`}
                    onClick={toggleModal}
                  >
                    <EditIcon fontSize="1px" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <p className="m-0 text-lg font-semibold text-black truncate">
                      {profile.Name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <div className="text-[#7F7F7F]">
                      <p className="m-0">Employee ID</p>
                      <p className="m-0">Designation</p>
                      <p className="m-0">Email</p>
                    </div>

                    <div className="text-black">
                      <p className="m-0">
                        :{" "}
                        {profile.EmployeeID ? (
                          profile.EmployeeID
                        ) : (
                          <span>-</span>
                        )}
                      </p>
                      <p className="m-0">
                        :{" "}
                        {profile.Designation ? (
                          profile.Designation
                        ) : (
                          <span>-</span>
                        )}
                      </p>
                      <p className="m-0">
                        : {profile.Email ? profile.Email : <span>-</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* modal update admin details */}
      {modal && (
        <div className="z-10 fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 fixed inset-0"
            onClick={toggleModal}
          />
          <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-3">
            <div className="card-title flex justify-between">
              <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
                Update Your Profile
              </h2>
              <CloseIcon
                onClick={toggleModal}
                fontSize="1px"
                className={`hover:cursor-pointer hover:bg-[#414141] w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
              />
            </div>
            {profile && <UpdateEmployee id={profile.EmployeeID} />}
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetails;
