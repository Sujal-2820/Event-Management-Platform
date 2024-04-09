// // event/src/app/components/navbar.js

import "./navbar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';



function NavbarComponent() {

  const router = useRouter();

  const toSignupPage = () => {
    router.push('/signup');
  }

  const directToHome = () => {
    router.push('/');
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
        EventSphere
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={directToHome}>
              <i className="fas fa-home"></i> Home
            </Nav.Link>
            <Nav.Link href="#home">
              <i className="fas fa-info-circle"></i> About
            </Nav.Link>
            <NavDropdown title="Explore Events" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Technology</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Environment
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                Share Market
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Other</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link onClick={toSignupPage}>
              <i className="fas fa-user"></i> Signup/Login
            </Nav.Link>
            {/* <span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
