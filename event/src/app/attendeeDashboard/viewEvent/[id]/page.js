// src/app/attendeeDashboard/viewEvent/[id]/page.js

"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { imageDb } from "../../../../../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import "./QuizPopUp.css";
import "./eventPage.css";
import "./registrationPopup.css";
import AttendeeNavbarComponent from "@/app/components/attendeeNavbar/attendeeNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/app/components/footer/Footer";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";


const viewEvent = () => {
  const router = useRouter();
  const { id } = useParams();
  const [eligibilityStatus, setEligibilityStatus] = useState("");
  const [openQuizPopup, setOpenQuizPopup] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [buttonStyle, setButtonStyle] = useState("dull-background");
  const [openRegistrationPopup, setOpenRegistrationPopup] = useState(false);
  const [showSuccessfulRegistrationToast, setShowSuccessfulRegistrationToast] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");

  const [data, setData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  
  const [additionalInfo, setAdditionalInfo] = useState({
    organizerEmail: "",
    eventDateTime: "",
    eventLocation: "",
  });

  const [quizData, setQuizData] = useState({
    quizQuestions: [],
    timePerQuestion: 0,
    minimumScore: 0,
  });

  const [remainingTime, setRemainingTime] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const questionIndexRef = useRef(0);

  const [fullName, setFullName] = useState("");
  const [workEmail, setworkEmail] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [linkedinURL, setLinkedinURL] = useState("");
  const [reasonToJoin, setReasonToJoin] = useState("");

  const handleShowQuizPopUp = () => {
    setOpenQuizPopup(true);
    setButtonStyle("dull-background");
  };

  const handleShowRegistrationPopUp = () => {
    setOpenRegistrationPopup(true);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleOptionSelect = (selectedOption) => {
    setUserAnswers((prevAnswers) => [...prevAnswers, selectedOption]);
  };


  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Check if the eligibilityStatus is empty
      if (!eligibilityStatus) {
        alert(
          "Error registering for event. Seems like you haven't given the test!!"
        );
        return;
      }

      const response = await axios.post(
        `https://event-management-platform.onrender.com/registration/${id}`,
        { eligibilityStatus, fullName, workEmail, githubURL, linkedinURL, reasonToJoin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Registration successful:", response.data);
      setRegistrationMessage(response.data.message);
      setShowSuccessfulRegistrationToast(true);
      setOpenRegistrationPopup(false);
    } catch (error) {
      console.error("Error registering for event:", error);

      if (error.response && error.response.status === 400) {
        // Handle the case where the user is already registered
        alert(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        // Handle the case where the user is not eligible to register
        alert(
          "Sorry, you did not pass the eligibility test earlier. Therefore the registration process cannot happen for this event"
        );
      } else {
        // Handle other errors
        alert("Error registering for event");
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("authToken");

    axios
      .get(`https://event-management-platform.onrender.com/public/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        const fetchedData = response.data;
        console.log(fetchedData);
        setData({
          title: fetchedData.title,
          description: fetchedData.description,
        });

        const imgs = await listAll(ref(imageDb, `files/${id}`));
        const urls = await Promise.all(
          imgs.items.map((val) => getDownloadURL(val))
        );

        const imageUrl = urls.length > 0 ? urls[0] : "";
        setData((prevData) => ({ ...prevData, imageUrl }));

        const { organizerEmail, eventDateTime, eventLocation } = fetchedData;
        setAdditionalInfo({ organizerEmail, eventDateTime, eventLocation });
        

        // Fetch quiz questions and timePerQuestion from MongoDB
        const { quizQuestions, timePerQuestion, minimumScore } = response.data;

        setQuizData({
          quizQuestions: quizQuestions || [],
          timePerQuestion: timePerQuestion || 0,
          minimumScore: minimumScore || 0,
        });
        setRemainingTime(timePerQuestion || 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const calculateScore = () => {
    let correctAnswers = 0;

    quizData.quizQuestions.forEach((question, index) => {
      const correctOption = question.correctOption - 1;
      const userAnswer = userAnswers[index];

      if (userAnswer === correctOption) {
        correctAnswers += 1;
      }
    });

    return correctAnswers;
  };

  const handleQuizComplete = () => {
    const score = calculateScore();

    let updatedEligibilityStatus;
    if (score >= quizData.minimumScore) {
      updatedEligibilityStatus = "You are eligible to attend the event";   
    } else {
      updatedEligibilityStatus = "You are not eligible to attend the event";
    }

    setEligibilityStatus(updatedEligibilityStatus);

    setTimeout(() => {
      setOpenQuizPopup(false);
    }, 8000);
  };



  useEffect(() => {
    let timer;
    if (
      showQuiz &&
      questionIndexRef.current <= quizData.quizQuestions.length &&
      !quizOver
    ) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);

            if (questionIndexRef.current === quizData.quizQuestions.length) {
              setQuizOver(true);
              handleQuizComplete();
            } else {
              questionIndexRef.current = currentQuestionIndex + 1;
              setCurrentQuestionIndex(questionIndexRef.current);
              setRemainingTime(quizData.timePerQuestion);
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [showQuiz, quizData, quizOver, currentQuestionIndex]);


  useEffect(() => {
    if (eligibilityStatus === "You are eligible to attend the event") {
      setButtonStyle("bright-background");
    } else if (eligibilityStatus === "You are not eligible to attend the event") {
      setButtonStyle("dull-background");
    }
  }, [eligibilityStatus]);

  return (
    <>
    <AttendeeNavbarComponent/>
    <div>
    <div className="quirky-event-container">
      <h2 className="event-details-heading">Event Details</h2>
      <br />
      {data.imageUrl && (
        <img
          className="unique-event-image"
          src={data.imageUrl}
          alt="Event Image"
        />
      )}
      <br /><br/>
      <h3 className="funky-title">{data.title}</h3>
      <p className="funky-description">{data.description}</p>
      <br/>
      <p className="additional-info">Organizer Email: <span className="additional-info-organizer-email">{additionalInfo.organizerEmail}</span></p>
<p className="additional-info">Event Date: <span className="additional-info-event-date">{new Date(additionalInfo.eventDateTime).toDateString()}</span></p>
<p className="additional-info">Event Location: <span className="additional-info-event-location"><a href={additionalInfo.eventLocation} target="_blank" rel="noopener noreferrer">View Event Location</a></span></p>
      <br/><br/>

      <button onClick={handleShowQuizPopUp} className="quirky-quiz-button">
        Take Test
      </button>

      <br />
      <button
        className={`funky-register-button ${buttonStyle}`}
        onClick={handleShowRegistrationPopUp}
      >
        Register
      </button>

      {openQuizPopup && (
        <div className="offbeat-quiz-popup">
          <div className="wacky-quiz-content">
            {!showQuiz ? (
              <>
                <h3 className="confirm-heading">
                  Are you ready to take the test?
                </h3>
                <br />
                <button className="confirm-button" onClick={handleStartQuiz}>
                  Yes
                </button>
              </>
            ) : (
              <>
                {!quizOver ? (
                  <>
                    <div className="unique-timer">
                      <p>Time Remaining: {remainingTime} seconds</p>
                    </div>
                    <div
                      className="quirky-quizQuestion-box"
                      key={currentQuestionIndex}
                    >
                      <label className="question-number-label">{`Question ${
                        currentQuestionIndex + 1
                      }:`}</label>
                      <br />
                      <br />
                      <p className="question-heading">
                        {
                          quizData.quizQuestions[currentQuestionIndex]
                            ?.questionText
                        }
                      </p>
                      <br />
                      {[0, 1, 2, 3].map((optionIndex) => (
                        <div key={optionIndex}>
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={optionIndex}
                            id={`question-${currentQuestionIndex}-option-${optionIndex}`}
                            onChange={() => handleOptionSelect(optionIndex)}
                          />
                          <span> </span>
                          <label
                            htmlFor={`question-${currentQuestionIndex}-option-${optionIndex}`}
                          >
                            {
                              quizData.quizQuestions[currentQuestionIndex]
                                ?.options[optionIndex].text
                            }
                          </label>
                          <br />
                          <br />
                        </div>
                      ))}
                      <br />
                    </div>
                  </>
                ) : (
                  <>
                    <p>Test Over</p>
                    <br />
                    <p className="test-score">
                      Your Score: {calculateScore()} question answered
                      correctly.
                    </p>
                    {quizData.minimumScore && (
                      <>
                        {eligibilityStatus && (
                          <p className="quirky-eligibility-message">
                            {eligibilityStatus}
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {openRegistrationPopup && (
        <div
          className="peculiar-registration-popup"
          style={openRegistrationPopup ? {} : { display: "none" }}
        >
          <div className="offbeat-registration-content">
            <br/>
            <label className="odd-label">Your Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="unique-input-style"
            />
            <label className="odd-label">Work Email:</label>
            <input
              type="text"
              value={workEmail}
              onChange={(e) => setworkEmail(e.target.value)}
              className="unique-input-style"
            />
            <label className="odd-label">Github URL:</label>
            <input
              type="text"
              value={githubURL}
              onChange={(e) => setGithubURL(e.target.value)}
              className="unique-input-style"
            />
            <label className="odd-label">LinkedIn URL:</label>
            <input
              type="text"
              value={linkedinURL}
              onChange={(e) => setLinkedinURL(e.target.value)}
              className="unique-input-style"
            />
            <label className="odd-label">
              Why do you want to join this event?
            </label>
            <textarea
              value={reasonToJoin}
              onChange={(e) => setReasonToJoin(e.target.value)}
              className="unique-textarea-style"
            />
            <button
              onClick={handleRegister}
              className="peculiar-submit-button-style"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>

    

    <Toast
        show={showSuccessfulRegistrationToast}
        onClose={() => setShowSuccessfulRegistrationToast(false)}
        className="custom-toast-message-attendee-view-event"
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">EventSphere</strong>
        </Toast.Header>
        <Toast.Body>{registrationMessage}</Toast.Body>
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="primary"
            onClick={() => setShowSuccessfulRegistrationToast(false)}
          >
            OK
          </Button>
        </div>
      </Toast>
</div>
      <Footer/>
    </>
  );
};

export default viewEvent;
