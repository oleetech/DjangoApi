// স্টেপ ১: ইম্পোর্ট করি
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import DownloadingIcon from "@mui/icons-material/Downloading";
import CheckInIcon from "@mui/icons-material/WhereToVote";
import CheckOutIcon from "@mui/icons-material/LocationOff";
import { hoverScale } from "../../components/DesignStandardize";

const GiveAttendance = () => {
  // স্টেপ 2: স্টেট ভেরিয়েবল
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [user, setUser] = useState(null);
  // const [task, setTask] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      setUser(userObject);
    }
  }, []);

  // স্টেপ 4: Get Location
  const handleGetLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(location);
          setUserLocation(location);

          // Use OpenCage Geocoding API to get location name
          try {
            const apiKey = "a3d93e3753d147c0b8bfdc5a13ae58da"; // Replace with your OpenCage API key
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${location.lat}+${location.lng}&pretty=1`
            );

            if (response.data.results.length > 0) {
              const name = response.data.results[0].formatted;
              setLocationName(name);
            } else {
              console.log("OpenCage Geocoding API did not return any results.");
            }
          } catch (error) {
            console.error("Error fetching location data:", error.message);
          }

          // রিভার্স জিওকোডিং ব্যবহার করে স্থানের নাম পোস্ট করুন
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
            );
            console.log(response.data);
            if (response.data.results.length > 0) {
              const name = response.data.results[0].formatted_address;
              setLocationName(name);
            } else {
              console.log("Geocoding API news did not include any results.");
            }
          } catch (error) {
            console.log("Problems searching for place names:", error.message);
          }
          setLoading(false);
        },
        (error) => {
          console.log(`Problem getting user space: ${error.message}`);
          setLoading(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const ourDateTime = new Date();
  const timeZone = "Asia/Dhaka";

  // Create a formatter with the specified time zone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const handleInsertAttendance = async () => {
    try {
      const hours = currentDateTime.getHours();
      const minutes = currentDateTime.getMinutes();
      const formattedTime =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0");

      if (user && userLocation && currentDateTime) {
        const payload = {
          EmployeeID: user.employeeID,
          LoginTime: formattedTime,
          LogoutTime: null,
          locationName: locationName,
          Date: formatter.format(ourDateTime),
          Leave: false,
          locationNameLogout: false,
          Latitude: userLocation.lat,
          Longitude: userLocation.lng,
        };
        console.log(payload);
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/create`;

        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `${localStorage.getItem("jwtToken")}`,
          },
        });
        console.log(payload);

        if (response.data.type === "success") {
          toast.success("Attendance has been successfully added!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          localStorage.setItem("ispresent", true);
      

          // setTask(true);
          console.log("Presence added successfully!", response.data);
        } else if (response.data.type === "existing") {
          toast.warning("Attendance records already exist for this employee!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          console.log("Attendance record is already there!");
        }
      } else {
        toast.error("User, user location, or current date-time not found.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      // Display the warning toast for existing record
      if (error.response?.data?.type === "existing") {
        toast.warning("Attendance records already exist for this employee!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("Attendance record is already there");
      } else {
        // Display the error message in toast
        toast.error(
          `Problems adding presence: ${
            error.response?.data?.message || "Unknown error"
          }`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        console.log("Problems adding presence:", error.response);
      }
    }
  };

  const handleUpdateOutTime = async () => {
    try {
      const hours = currentDateTime.getHours();
      const minutes = currentDateTime.getMinutes();
      const formattedTime =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0");

      if (user && userLocation && currentDateTime) {
        const payload = {
          EmployeeID: user.employeeID,
          LogoutTime: formattedTime,
          Date: currentDateTime.toISOString().split("T")[0],
          locationNameLogout: locationName,
        };

        // Example API endpoint (replace with your actual endpoint)
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/attendance/outtime`;

        // Send the data to the API with the token in the headers
        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `${localStorage.getItem("jwtToken")}`,
          },
        });
        localStorage.setItem("ispresent", false);

        toast.success("Attendance has been completed successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(
          "Attendance has been completed successfully!",
          response.data
        );
        console.log(payload);
      }
    } catch (error) {
      // Display the error message in toast
      toast.error(`Error updating LogoutTime:`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("Error updating LogoutTime:", error.response);
    }
  };

  // স্টেপ 8: Google Map Handler
  const openGoogleMaps = () => {
    if (userLocation) {
      const { lat, lng } = userLocation;
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(mapUrl, "_blank");
    }
  };

  // বর্তমান তারিখকে YYYY-MM-DD হিসেবে বিন্যাস করুন
  const formattedDate = currentDateTime.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // বর্তমান সময়কে MySQL বিন্যাসে (HH:mm:ss) বিন্যাস করুন
  const formattedTime = currentDateTime.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  // Custom marker icon
  const customMarkerIcon = new L.Icon({
    iconUrl: `${process.env.PUBLIC_URL}/mapicon.png`,
    iconSize: [32, 32], // Adjust the size of the icon
    iconAnchor: [16, 32], // Adjust the anchor point
    popupAnchor: [0, -32], // Adjust the popup anchor point
  });

  return (
    <>
      {user && (
        <div className="font-Inter flex flex-col md:flex-row gap-3 items-center my-2 lg:border-r-2 lg:border-solid lg:pr-2 mx-auto">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] md:font-extrabold m-0">
              Give Attendance
            </h2>

            <div className="flex gap-3 py-3 mx-auto">
              <button
                className={`w-max py-1 pl-1 pr-2 text-white border rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
                onClick={handleInsertAttendance}
              >
                <CheckInIcon /> Check-in
              </button>

              <button
                className={`light-button ${hoverScale}`}
                onClick={handleUpdateOutTime}
              >
                <CheckOutIcon /> Check-out
              </button>
              {/* {task && (
                <button className={`light-button ${hoverScale}`}>
                  <Link to="/task">Task</Link>
                </button>
              )} */}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center w-64 h-64 md:h-56 md:w-56 border-2 rounded">
              <p className="loading loading-bars loading-md" />
            </div>
          ) : userLocation ? (
            <MapContainer
              className="ring-offset-2 ring-2 rounded h-64 w-64 md:h-56 md:w-56 z-0"
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={customMarkerIcon}
              >
                <Popup>{locationName || "Your location"}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center rounded bg-[#D9D9D9] w-64 h-64 md:h-56 md:w-56">
              <button
                className={`w-max h-max p-1 text-white rounded-lg bg-gradient-to-b from-[#6782e6] to-[#214DED] ${hoverScale}`}
                onClick={handleGetLocation}
              >
                <DownloadingIcon /> Load Location
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GiveAttendance;
