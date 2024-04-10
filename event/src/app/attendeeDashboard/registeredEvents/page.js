'use client'

// src/app/attendeeDashboard/registeredEvents/page.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { imageDb } from '../../../../firebase';
import { listAll, getDownloadURL, ref } from 'firebase/storage'; // Import necessary Firebase storage functions
import { useRouter } from 'next/navigation';
import "bootstrap/dist/css/bootstrap.min.css";
import AttendeeNavbarComponent from '@/app/components/attendeeNavbar/attendeeNavbar';


const RegisteredEvents = () => {
  const router = useRouter();
  const [registeredEventsData, setRegisteredEventsData] = useState([]);

  useEffect(() => {
    // Retrieve user information from local storage or API
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      const token = localStorage.getItem('authToken');
      // Fetch registered events data
      axios
        .get('https://event-management-platform.onrender.com/registration', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          const registeredEvents = response.data.registeredEvents;

          // Process the registered events data
          const dataWithImages = await Promise.all(
            registeredEvents.map(async (entry) => {
              const imgs = await listAll(ref(imageDb, `files/${entry._id}`));
              const urls = await Promise.all(imgs.items.map((val) => getDownloadURL(val)));
              const imageUrl = urls.length > 0 ? urls[0] : '';

              return { ...entry, imageUrl };
            })
          );

          // Set the state with the processed data
          setRegisteredEventsData(dataWithImages);
        })
        .catch((error) => {
          console.error('Error fetching registered events data:', error);
        });
    } else {
      // Redirect to sign-in if user information is not available
      router.push('/signin');
    }
  }, [router]);

  return (
    <>
    <AttendeeNavbarComponent/>
    <div className="container">
      <h2 className="text-center mb-4">Your Registered Events:</h2>
      <div className="row">
        {registeredEventsData.map((item, index) => (
          <div key={item._id || index} className="col-md-4 mb-4">
            <div className="card">
              {item.imageUrl && (
                <img src={item.imageUrl} className="card-img-top" alt="Event Image" />
              )}
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <button onClick={() => router.push(`/attendeeDashboard/viewRegisteredEvent/${item._id}`)} className="btn btn-primary">View Event</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default RegisteredEvents;
