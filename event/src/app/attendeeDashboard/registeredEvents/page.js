'use client'

// src/app/attendeeDashboard/registeredEvents/page.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { imageDb } from '../../../../firebase';
import { listAll, getDownloadURL, ref } from 'firebase/storage'; // Import necessary Firebase storage functions
import { useRouter } from 'next/navigation';

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
    <div>
    <h2>Your Registered Events:</h2>
    <br />
      <ul>
        {registeredEventsData.map((item, index) => (
          <li key={item._id || index}>
            <p>Title: {item.title}</p>
            <p>Description: {item.description}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt="Event Image" height="200" width="200" />
            )}
            <button onClick={() => router.push(`/attendeeDashboard/viewRegisteredEvent/${item._id}`)}>
              View Event
            </button>
            <br />
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredEvents;