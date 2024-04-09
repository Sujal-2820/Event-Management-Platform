// src/app/dashboard/addData/page.js

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { imageDb } from "../../../../firebase.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import LoadingPopup from "./LoadingPopup.js";
import "./addData.css";
import OrganizerNavbarComponent from "@/app/components/organizerNavbar/organizerNavbar.js";
import "bootstrap/dist/css/bootstrap.min.css";


function AddData() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [includeQuizQuestions, setIncludeQuizQuestions] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState("");
  const [minimumScore, setMinimumScore] = useState("");

  const [organizerEmail, setOrganizerEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailDescription, setEmailDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDomain, setEventDomain] = useState("");

  const handleCheckboxChange = () => {
    setIncludeQuizQuestions(!includeQuizQuestions);
  };

  const initialQuestionSet = {
    questionText: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOption: "",
  };

  const [questionSets, setQuestionSets] = useState([initialQuestionSet]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading

  const router = useRouter();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleEventDomainChange = (e) => {
    setEventDomain(e.target.value);
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const addQuestion = (e) => {
    e.preventDefault();
    setQuestionSets([...questionSets, initialQuestionSet]);
    setErrorMessages([]);
  };

  const deleteQuestion = (index) => {
    const updatedQuestionSets = [...questionSets];
    updatedQuestionSets.splice(index, 1);
    setQuestionSets(updatedQuestionSets);
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestionSets = [...questionSets];
    updatedQuestionSets[index].questionText = event.target.value; // Change to questionText
    setQuestionSets(updatedQuestionSets);
  };

  const handleOptionChange = (index, optionIndex, event) => {
    const updatedQuestionSets = [...questionSets];
    updatedQuestionSets[index].options[optionIndex].text = event.target.value;
    setQuestionSets(updatedQuestionSets);
  };

  const handleCorrectOptionChange = (index, event) => {
    const value = event.target.value;
    const isNumeric = /^\d+$/.test(value);
    const isValidOption = isNumeric && Number(value) >= 1 && Number(value) <= 4;

    const updatedQuestionSets = [...questionSets];
    updatedQuestionSets[index].correctOption = isValidOption ? value : "";
    updatedQuestionSets[index].correctOptionIndex = isValidOption
      ? Number(value) - 1
      : null;

    // Update error messages
    const newErrorMessages = isValidOption
      ? []
      : [
          `Invalid input for Question ${
            index + 1
          }. Please enter a number between 1 and 4.`,
        ];

    // Add validation for questionText and options
    if (!updatedQuestionSets[index].questionText) {
      newErrorMessages.push(`Question ${index + 1} is required.`);
    }

    if (
      !updatedQuestionSets[index].options.every(
        (option) => option.text.trim() !== ""
      )
    ) {
      newErrorMessages.push(`Options for Question ${index + 1} are required.`);
    }

    setErrorMessages(newErrorMessages);
    setQuestionSets(updatedQuestionSets);
  };

  const handleTimePerQuestionChange = (e) => {
    setTimePerQuestion(e.target.value);
  };

  const handleMinimumScoreChange = (e) => {
    setMinimumScore(e.target.value);
  };

  const handleOrganizerEmailChange = (e) => {
    setOrganizerEmail(e.target.value);
  };

  const handleEmailSubjectChange = (e) => {
    setEmailSubject(e.target.value);
  };

  const handleEmailDescriptionChange = (e) => {
    setEmailDescription(e.target.value);
  };

  const handleEventDateTimeChange = (e) => {
    setEventDateTime(e.target.value);
  };

  const handleEventLocationChange = (e) => {
    setEventLocation(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      // Send a request to the backend to generate and send OTP to the provided email
      const response = await axios.post(
        "https://event-management-platform.onrender.com/mailVerify/generate-otp",
        { email: organizerEmail }
      );
      alert(
        "An OTP has been sent to the Organizer's Email Id. Please check your email."
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Send a request to the backend to verify the OTP
      const response = await axios.post(
        "https://event-management-platform.onrender.com/mailVerify/verify-otp",
        { email: organizerEmail, otp }
      );
      setOtpVerified(true);
      alert("OTP Verified Successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert(
        "Error verifying OTP. Please make sure you have entered the correct OTP."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the OTP is verified
    if (!otpVerified) {
      alert(
        "Please verify your email with the OTP before submitting the form."
      );
      return;
    }

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      router.push("/signin");
      return;
    }

    if (img !== null) {
      try {
        setLoading(true);
        console.log("Submitting data...");

        const requestData = {
          title,
          description,
          imageUrl: [],
          eventDomain,
          ...(includeQuizQuestions && { quizQuestions: questionSets }), // Include quizQuestions conditionally
          timePerQuestion,
          minimumScore,
          organizerEmail,
          emailSubject,
          emailDescription,
          eventDateTime,
          eventLocation,
        };

        // Submit data
        const response = await axios.post(
          "https://event-management-platform.onrender.com/auth/dashboard/data",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("Data submitted successfully:", response.data);

        const dataId = response.data.data._id;
        const fileName = img.name; // Get the selected file name

        const imgRef = ref(imageDb, `files/${dataId}/${fileName}`);

        console.log("Uploading image...");
        await uploadBytes(imgRef, img);
        const url = await getDownloadURL(imgRef);

        console.log("Image uploaded successfully. URL:", url);

        // Update MongoDB entry with the file name
        await axios.put(
          `https://event-management-platform.onrender.com/auth/dashboard/data/${dataId}`,
          { imageUrl: [fileName] }, // Use an array for imageUrl
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("MongoDB entry updated successfully.");

        alert("Data submitted successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error adding data:", error);
        // Handle error
      } finally {
        // Set loading to false to hide the popup
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <OrganizerNavbarComponent />
      <div className="container mt-5">
      <h1 className="add-data-title">Add Data</h1>
      <form onSubmit={handleSubmit} className="add-data-form row g-3">
        <div className="col-md-6">
          <label htmlFor="title" className="add-data-title-label form-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
            className="add-data-title-input form-control"
            id="title"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="description" className="add-data-description-label form-label">Description:</label>
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            required
            className="add-data-description-input form-control"
            id="description"
          />
        </div>
        <div className="col-12">
          <label htmlFor="eventDomain" className="add-data-domain-label form-label">Select Event Domain:</label>
          <select
            className="add-data-domain-select form-select"
            value={eventDomain}
            onChange={handleEventDomainChange}
            required
            id="eventDomain"
          >
            <option value="">Select Event Domain</option>
            <option value="Technology">Technology</option>
            <option value="Marketing">Marketing</option>
            <option value="Medical/Healthcare">Medical/Healthcare</option>
              <option value="Business/Entrepreneurship">
                Business/Entrepreneurship
              </option>
              <option value="Finance">Finance</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Social Media">Social Media</option>
              <option value="Innovation">Innovation</option>
              <option value="Digital Transformation">
                Digital Transformation
              </option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Space Exploration">Space Exploration</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Leadership">Leadership</option>
              <option value="Customer Experience">Customer Experience</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Diversity and Inclusion">
                Diversity and Inclusion
              </option>
            {/* Add other options here */}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="image" className="add-data-image-label form-label">Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="add-data-image-input form-control"
            id="image"
          />
        </div>

        <div className="col-12">
          <label className="add-data-include-label form-check-label">Include Quiz Questions:</label>
          <input
            type="checkbox"
            checked={includeQuizQuestions}
            onChange={handleCheckboxChange}
            className="add-data-include-checkbox form-check-input"
            id="includeQuizQuestions"
          />
        </div>

        {includeQuizQuestions && (
          <div className="col-12">
            <h2 className="add-data-quiz-title">Quiz Questions</h2>
            {questionSets.map((questionSet, index) => (
              <div key={index}>
                <h3 className="add-data-question-title">Question {index + 1}</h3>
                <div>
                  {errorMessages[index] && (
                    <p className="add-data-error-message">{errorMessages[index]}</p>
                  )}
                  <div>
                  <input
                    type="text"
                    placeholder="Question"
                    value={questionSet.questionText}
                    onChange={(event) => handleQuestionChange(index, event)}
                    className="add-data-question-input form-control"
                  />
                  <button className="X-button btn btn-danger" onClick={() => deleteQuestion(index)}>X</button>
                
                  </div>
                  </div>
                {questionSet.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option.text}
                      onChange={(event) => handleOptionChange(index, optionIndex, event)}
                      className="add-data-option-input form-control"
                    />
                  </div>
                ))}
                <div>
                  <input
                    type="text"
                    placeholder="Correct Option"
                    value={questionSet.correctOption}
                    onChange={(event) => handleCorrectOptionChange(index, event)}
                    className="add-data-correct-option-input form-control"
                  />
                </div>
              </div>
            ))}
            <div>
              <button onClick={addQuestion} className="add-data-add-question-button btn btn-primary">Add Question</button>
            </div>
            <div>
              <label className="add-data-time-per-question-label form-label">Time per question in Seconds:</label>
              <input
                type="text"
                value={timePerQuestion}
                onChange={handleTimePerQuestionChange}
                className="add-data-time-per-question-input form-control"
              />
            </div>
            <div>
              <label className="add-data-minimum-score-label form-label">Minimum Number of Correct Questions to be eligible for the Event:</label>
              <input
                type="text"
                value={minimumScore}
                onChange={handleMinimumScoreChange}
                className="add-data-minimum-score-input form-control"
              />
            </div>
          </div>
        )}

        <div className="col-12 Email-Inputs">
          <div>
            <p className="add-data-warning-note">NOTE: You won't be able to change Organizer's Email after creating this event. Enter it carefully!!</p>
            <label htmlFor="organizerEmail" className="add-data-organizer-email-label form-label">Organizer's Email:</label>
            <input
              type="email"
              value={organizerEmail}
              onChange={handleOrganizerEmailChange}
              required
              className="add-data-organizer-email-input form-control"
              id="organizerEmail"
            />
            <button type="button" onClick={handleSendOtp} className="add-data-send-otp-button btn btn-primary">Send OTP</button>
          </div>
          <div>
            <label htmlFor="otp" className="add-data-otp-label form-label">Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              required
              className="add-data-otp-input form-control"
              id="otp"
            />
            <button type="button" onClick={handleVerifyOtp} className="add-data-verify-otp-button btn btn-primary">Verify OTP</button>
          </div>
          <div>
            <label htmlFor="emailSubject" className="add-data-email-subject-label form-label">Email Subject:</label>
            <input
              type="text"
              value={emailSubject}
              onChange={handleEmailSubjectChange}
              required
              className="add-data-email-subject-input form-control"
              id="emailSubject"
            />
          </div>
          <div>
            <label htmlFor="emailDescription" className="add-data-email-description-label form-label">Email Description:</label>
            <input
              type="text"
              value={emailDescription}
              onChange={handleEmailDescriptionChange}
              required
              className="add-data-email-description-input form-control"
              id="emailDescription"
            />
          </div>
          <div>
            <label htmlFor="eventDateTime" className="add-data-event-datetime-label form-label">Event Date & Time:</label>
            <input
              type="datetime-local"
              value={eventDateTime}
              onChange={handleEventDateTimeChange}
              required
              className="add-data-event-datetime-input form-control"
              id="eventDateTime"
            />
          </div>
          <div>
            <label htmlFor="eventLocation" className="add-data-event-location-label form-label">Event Location:</label>
            <input
              type="text"
              value={eventLocation}
              onChange={handleEventLocationChange}
              required
              className="add-data-event-location-input form-control"
              id="eventLocation"
            />
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="add-data-submit-button btn btn-primary">Submit Data</button>
        </div>
      </form>
    </div>

      {/* Loading Popup */}
      {loading && <LoadingPopup />}
    </div>
  );
}

export default AddData;
