// components/cards/js

"use client";

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast"; // Import the Toast component
import "./cards.css";
import { useRouter } from "next/navigation";

function Cards() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false); // State to control toast visibility

  const cardData = [
    {
      title: "SparkleWay",
      description: "Business breakthroughs start here.",
      imageUrl: "/static/images/techEvent.jpg",
    },
    {
      title: "Techtopia",
      description: "Invest in your future. Tech solutions for all.",
      imageUrl: "/static/images/techtopia.jpg",
    },
    {
      title: "Futureproof",
      description: "Tech for tomorrow's success. Start today.",
      imageUrl: "/static/images/future.jpg",
    },
  ];

  const directToSignin = () => {
    setShowToast(true); // Show the toast
    setTimeout(() => {
      router.push("/signin");
    }, 5000); // Redirect to signin page after 3 seconds
  };

  return (
    <div className="home-page-card-container card-container">
      <Container>
        <Row className="unique-home-page-card-container-row">
          {cardData.map((card, index) => (
            <Col key={index}>
              <Card
                style={{ width: "18rem" }}
                className="unique-home-page-each-card each-card"
              >
                <Card.Img variant="top" src={card.imageUrl} />
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                  <Button onClick={directToSignin} variant="primary">
                    View Event
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Toast component for displaying the message */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: "fixed",
          top: "15%", // Position at the vertical center
          left: "50%", // Position at the horizontal center
          transform: "translate(-50%, -50%)", // Center the toast
          zIndex: 1,
          width: "40%", // Increase width for a bigger appearance
          maxWidth: "none",
          margin: 0,
          borderRadius: 8, // Increase border-radius for a rounded appearance
          backgroundColor: "#2e2e2f",
          padding: "20px", // Increase padding for more space
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Increase box shadow for depth
          color: "aliceblue",
          fontSize: "1.2rem", // Increase font size for better readability
          display: "flex", // Use flexbox layout
          flexDirection: "column", // Arrange children in a column
          alignItems: "flex-start", // Align children to the start (left)
        }}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">EventSphere</strong>
        </Toast.Header>
        <Toast.Body>You need to Login before viewing the event.</Toast.Body>
        <div style={{ marginTop: "10px" }}>
          <Button variant="primary" onClick={() => setShowToast(false)}>
            OK
          </Button>
        </div>
      </Toast>
    </div>
  );
}

export default Cards;
