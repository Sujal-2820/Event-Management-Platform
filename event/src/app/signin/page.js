"use client";

// src/app/signin/page.js
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./signin.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 


  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });
      const { user, token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userType", user.userType);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("userType", user.userType);

      // Redirect based on user type
      if (user.userType === "Organizer") {
        router.push("/dashboard");
      } else if (user.userType === "Attendee") {
        router.push("/attendeeDashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, display error messages, etc.

      // Handle errors, display error messages, etc.
      if (error.response) {
        // Server responded with an error status code
        if (error.response.status === 404) {
          // User not found
          setError("Error: No User not found with that username.");
        } else if (error.response.status === 401) {
          // Wrong password
          setError("Error: Wrong password");
        } else {
          // Other server errors
          setError("Server error. Please try again later.");
        }
      } else if (error.request) {
        // Request made but no response received
        setError("Network error. Please check your internet connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const directToSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="container">
      <div className="user signinBox">
        <div className="formBox">
          <h2>Login</h2>
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {error && <p className="signin-error-message">{error}</p>}
            <br/>
            <button type="submit">Login</button>
          </form>
          <p className="signup">
            Don't have an Account? <a onClick={directToSignup}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
