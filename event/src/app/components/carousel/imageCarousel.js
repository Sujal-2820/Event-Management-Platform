import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'; // Import axios for making HTTP requests
import './imageCarousel.css';
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";



function ImageCarousel() {
  const router = useRouter();
  const [carouselData, setCarouselData] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch carousel data from your backend
        const response = await axios.get('https://event-management-platform.onrender.com/public');
        setCarouselData(response.data);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };
 
    fetchData();
  }, []);

  const imageStyle = {
    width: '100%',
    height: '50vh',
    objectFit: 'cover',
  };

  const directToSignin = () => {
    setShowToast(true); // Show the toast
    setTimeout(() => {
      router.push("/signin");
    }, 4500); // Redirect to signin page after 3 seconds
  };

  return (
    <>
    <Carousel className='carousel-body'>
      {carouselData.map((item, index) => (
        <Carousel.Item key={index} interval={3000}>
          <img
            className='d-block w-75'
            
            src={item.imageUrl}
            alt={`Slide ${index + 1}`}
            style={imageStyle}
          />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className='view-details-button' onClick={directToSignin}>View Details</button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
    <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className="custom-toast-message-image-carousel"
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">EventSphere</strong>
        </Toast.Header>
        <Toast.Body>Please Login before viewing the Details.</Toast.Body>
        <div style={{ marginTop: "10px" }}>
          <Button variant="primary" onClick={() => setShowToast(false)}>
            OK
          </Button>
        </div>
      </Toast>
    </>
  );
}

export default ImageCarousel;
