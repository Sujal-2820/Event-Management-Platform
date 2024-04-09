// // event/src/app/components/organizerNavbar.js

import "./organizerNavbar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useRouter } from "next/navigation";


function OrganizerNavbarComponent() {

  const router = useRouter();

  const toSignupPage = () => {
    router.push('/signup');
  }

  const directToHome = () => {
    router.push('/');
  }

  const directToSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    router.push("/");
  }

  const directToAddEvent = () => {
    router.push("/dashboard/addData/");
  }

  const directToDashbaord = () => {
    router.push("/dashboard");
  }


  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Event Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={directToHome}>
              <i className="fas fa-home"></i> Home
            </Nav.Link>
            <Nav.Link onClick={directToDashbaord}>
            <i class="fa fa-list-alt" aria-hidden="true"></i> Dashboard
            </Nav.Link>
            <Nav.Link onClick={directToAddEvent}>
              <i className="fas fa-plus-square"></i> Add Event
            </Nav.Link>
            <Nav.Link onClick={directToSignOut}>
              <i className="fas fa-sign-out"></i> Sign Out
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={toSignupPage}>
              <i className="fas fa-user"></i> Signup/Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default OrganizerNavbarComponent;
