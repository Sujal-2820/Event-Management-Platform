"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { imageDb } from "../../../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import "./attendeeDashboard.css";
import NavbarComponent from "../components/navbar/navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import eventsLoading from "./eventsLoading";
import AttendeeNavbarComponent from "../components/attendeeNavbar/attendeeNavbar";


const AttendeeDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  const [username, setUsername] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [organizerData, setOrganizerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Retrieve user information from local storage or API
    const storedUsername = localStorage.getItem("username");
    const userEmail = localStorage.getItem("email");
    const userType = localStorage.getItem("userType");

    if (storedUsername) {
      setUsername(storedUsername);
      setStoredEmail(userEmail);
      setUserType(userType);

      // Fetch organizer data
      axios
        .get("https://event-management-platform.onrender.com/public") // Replace with your API endpoint
        .then(async (response) => {
          const dataWithImages = await Promise.all(
            response.data.map(async (entry) => {
              const imgs = await listAll(ref(imageDb, `files/${entry._id}`));
              const urls = await Promise.all(
                imgs.items.map((val) => getDownloadURL(val))
              );
              const imageUrl = urls.length > 0 ? urls[0] : "";

              return { ...entry, imageUrl };
            })
          );

          setOrganizerData(dataWithImages);
          setFilteredData(dataWithImages); // Initialize filteredData with all organizerData
        })
        .catch((error) => {
          console.error("Error fetching organizer data:", error);
        }
      ).finally(() => {
        setLoading(false); // Set loading to false after data fetching completes
      });
    } else {
      // Redirect to sign-in if user information is not available
      router.push("/signin");
    }
  }, [router]);

  const handleSignOut = () => {
    // Clear user information from local storage and redirect to sign-in
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    router.push("/signin");
  };

  // Function to filter events based on search term
  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEvents = organizerData.filter((event) =>
      event.title.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filteredEvents);
  };

  return (
    <>
      <AttendeeNavbarComponent />

      <div className="attendee-dashboard-container">
        <h1 className="welcome-heading">Welcome {username}!</h1>
        <p className="email-paragraph">Your Email: {storedEmail}</p>
        <p className="user-type-paragraph">You are an: {userType}</p>

        <div className="event-list-section">
          <h2 className="event-list-heading">List of Events:</h2>
          <br />
          {/* Filter input */}
          <input
            type="text"
            className="event-filter-input"
            placeholder="Search events..."
            onChange={handleFilter}
          />

          <ul className="event-list">
            {filteredData.map((item) => (
              <li key={item._id} className="event-list-item">
                <p className="event-title">Title: {item.title}</p>
                <p className="event-description">
                  Description: {item.description}
                </p>
                {item.imageUrl && (
                  <img
                    className="event-image"
                    src={item.imageUrl}
                    alt="Organizer Image"
                  />
                )}
                <button
                  className="view-event-button"
                  onClick={() =>
                    router.push(`/attendeeDashboard/viewEvent/${item._id}`)
                  }
                >
                  View Event
                </button>
                <br />
                <br />
              </li>
            ))}
          </ul>
        </div>

        <button
          className="registered-events-button"
          onClick={() => router.push("/attendeeDashboard/registeredEvents/")}
        >
          View Registered Events
        </button>
        <br />
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      {loading && <eventsLoading />}
    </>
  );
};

export default AttendeeDashboard;
