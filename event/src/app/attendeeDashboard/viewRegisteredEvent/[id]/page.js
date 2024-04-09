// src/app/attendeeDashboard/viewRegisteredEvent/[id]/page.js

'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { imageDb } from '../../../../../firebase';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

const viewEvent = () => {
  const router = useRouter();
  const { id } = useParams();

  const [data, setData] = useState({
    title: '',
    description: '',
    imageUrl: '', // For storing image URL
  });


  const handleCancelRegister = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`http://localhost:5000/registration/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Cancellation successful:', response.data);
        alert('Cancellation successful');
        router.push('/attendeeDashboard/registeredEvents');
        // Optionally, you can update the UI or show a success message
      } catch (error) {
        console.error('Error canceling registration:', error);
        alert('Error canceling registration');
      }
  };



  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('authToken');

    axios
      .get(`http://localhost:5000/public/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(async (response) => {
        const fetchedData = response.data;
        setData({
          title: fetchedData.title,
          description: fetchedData.description,
        });

        // Fetch and set image URL for the data
        const imgs = await listAll(ref(imageDb, `files/${id}`));
        const urls = await Promise.all(imgs.items.map((val) => getDownloadURL(val)));

        const imageUrl = urls.length > 0 ? urls[0] : ''; // Assuming there's only one image per data entry
        setData((prevData) => ({ ...prevData, imageUrl }));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  return (
    <div className="single-event-container">
      <h2>Event Details</h2>
      <br />
      <p>Title: {data.title}</p>
      <br />
      <p>Description: {data.description}</p>
      <br />
      <h3>Image:</h3>
      {data.imageUrl && <img src={data.imageUrl} alt="Event Image" height="200" width="200" />}
      <br />
      <br />

      <button onClick={handleCancelRegister}>Cancel Registration</button>

    </div>
  );
};

export default viewEvent;
