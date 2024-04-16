"use client";

// src/app/signup/page.js
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from "../components/navbar/navbar";

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // 'Organizer' or 'Attendee'
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://event-management-platform.onrender.com/auth/signup", {
        username,
        email,
        password,
        userType,
      });
      console.log(response.data); // Assuming the response contains user info or a token
      router.push("/signin");
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, display error messages, etc.
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const directToSignin = () => {
    router.push("/signin");
  };

  return (
    <>
    <NavbarComponent/>
    <div className="container">
      <div className="user signupBox">
        <div className="formBox">
          <h2>Create An Account</h2>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <br />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <i className="fas fa-eye"></i>
                ) : (
                  <i className="fas fa-eye-slash"></i>
                )}
              </span>
            </div>
            <br />
            <br />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="">Select User Type</option>
              <option value="Organizer">Organizer</option>
              <option value="Attendee">Attendee</option>
            </select>
            <br />
            <br />
            <button type="submit">Sign Up</button>
          </form>
          <p className="signin">
            Already have an Account? <a onClick={directToSignin}>Login</a>
          </p>
        </div>
        <div className="imgBox">{/* Add image source here */}</div>
      </div>
    </div>
    </>
  );
};

export default SignUp;
