"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { imageDb } from "../../../firebase";
import { getDownloadURL, listAll, ref, deleteObject } from "firebase/storage";
import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import OrganizerNavbarComponent from "../components/organizerNavbar/organizerNavbar";
import contentLoading from "./contentLoading";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  const [username, setUsername] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [userEntries, setUserEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Retrieve user information from local storage or API
      const storedUsername = localStorage.getItem("username");
      const userEmail = localStorage.getItem("email");
      const userType = localStorage.getItem("userType");
      const authToken = localStorage.getItem("authToken");

      if (storedUsername && authToken) {
        setUsername(storedUsername);
        setStoredEmail(userEmail);
        setUserType(userType);

        try {
          const response = await axios.get(
            "https://event-management-platform.onrender.com/auth/dashboard/data/",
            {
              headers: {
                Authorization: `Bearer ${authToken}`, // Include auth token in the request headers
              },
            }
          );

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

          setUserEntries(dataWithImages);
        } catch (error) {
          console.error("Error fetching user entries:", error);
        }finally {
          setLoading(false); // Set loading to false after data fetching completes
        }
      } else {
        // Redirect to sign-in if user information or auth token is not available
        router.push("/signin");
      }
    };

    fetchData(); // Call the fetchData function
  }, [router]);

  const handleDelete = async (id, imageUrl) => {
    const authToken = localStorage.getItem("authToken");

    try {
      // Delete image from Firebase Storage
      await deleteObject(ref(imageDb, imageUrl));

      // Delete data from the server
      await axios.delete(`https://event-management-platform.onrender.com/auth/dashboard/data/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include auth token in the request headers
        },
      });

      // Update state to remove the deleted entry
      setUserEntries((prevEntries) =>
        prevEntries.filter((entry) => entry._id !== id)
      );
      alert("Data Deleted Successfully!!");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSignOut = () => {
    // Clear user information from local storage and redirect to sign-in
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    router.push("/signin");
  };

  const toAddEventPage = () => {
    router.push("/dashboard/addData/");
  };

  return (
    <>
      <OrganizerNavbarComponent />
      <div className="unique-organizer-dashboard-container">
      <h1 className="unique-organizer-dashboard-username-heading">
        Welcome {username}!
      </h1>
      <p className="unique-organizer-dashboard-email-paragraph">
        Your Email: {storedEmail}
      </p>
      <p className="unique-organizer-dashboard-user-type-paragraph">
        You are an: {userType}
      </p>

      <div className="unique-organizer-dashboard-user-entries-section">
        <h2 className="unique-organizer-dashboard-user-entries-heading">Your Data</h2>

        <div className="row">
          {userEntries.map((item, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card h-100">
                {item.imageUrl && (
                  <img
                    className="unique-organizer-image card-img-top"
                    src={item.imageUrl}
                    alt="Entry Image"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">Title: {item.title}</h5>
                  <p className="card-text">Description: {item.description}</p>
                </div>
                <div className="card-footer">
                  <div className="unique-organizer-dashboard-entry-buttons">
                    <button
                      className="unique-organizer-dashboard-update-button btn btn-primary me-2"
                      onClick={() =>
                        router.push(`/dashboard/updateData/${item._id}`)
                      }
                    >
                      Update
                    </button>
                    <button
                      className="unique-organizer-dashboard-delete-button btn btn-danger me-2"
                      onClick={() => handleDelete(item._id, item.imageUrl)}
                    >
                      Delete
                    </button>
                    <button
                      className="unique-organizer-dashboard-view-participants-button btn btn-secondary"
                      onClick={() =>
                        router.push(`/dashboard/viewParticipants/${item._id}`)
                      }
                    >
                      View Participants
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {loading && <contentLoading />}
    </>
  );
};

export default Dashboard;
