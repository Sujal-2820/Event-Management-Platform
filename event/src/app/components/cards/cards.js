// components/cards/js

'use client';

import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./cards.css";

function Cards() {
  // Static card data
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
    }
  ];

  return (
    <div className="home-page-card-container card-container">
      <Container>
        <Row className="unique-home-page-card-container-row">
          {cardData.map((card, index) => (
            <Col key={index}>
              <Card style={{ width: "18rem" }} className="unique-home-page-each-card each-card">
                <Card.Img variant="top" src={card.imageUrl} />
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col> 
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Cards;
