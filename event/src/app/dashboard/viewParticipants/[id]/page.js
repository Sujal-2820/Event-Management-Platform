//src/app/dashboard/viewParticipants/[id]/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import OrganizerNavbarComponent from "../../../components/organizerNavbar/organizerNavbar";
import "./viewParticipants.css";

const ViewParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`https://event-management-platform.onrender.com/auth/dashboard/data/participants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipants(response.data);
      } catch (error) { 
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <>
    <OrganizerNavbarComponent/>
    <div className="container text-center view-participant-container">
      <h2>Registered Participants</h2>
      <div className="row view-participants-row-unique">
        {participants.map((participant) => (
          <div key={participant._id} className="col">
            <div className="card participant-card" style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title participant-name">{participant.fullName}</h5>
                <p className="card-text">
                <a href={participant.githubURL} target="_blank" rel="noreferrer">Github</a>
                  <br />
                <a href={participant.linkedinURL} target="_blank" rel="noreferrer">LinkedIn</a>
                </p>
                <a href="#" className="btn btn-primary check-in-button">Check In</a>
              </div>
            </div> 
          </div>
        ))}
      </div>
      {participants.length === 0 && <p>No participants registered yet.</p>}
    </div>
    </>
  );
};

export default ViewParticipants;