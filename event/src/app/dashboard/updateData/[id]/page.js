"use client";
// src/app/dashboard/updateData/[id]/page.js

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { imageDb } from "../../../../../firebase";
import {
  getDownloadURL,
  listAll,
  uploadBytes,
  deleteObject,
  ref,
} from "firebase/storage";
import "./updateData.css";
import OrganizerNavbarComponent from "@/app/components/organizerNavbar/organizerNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";

const UpdateData = () => {
  const router = useRouter();
  const { id } = useParams();
  const [showUpdateSuccessToast, setShowUpdateSuccessToast] = useState(false);

  const [img, setImg] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    imageUrl: "", // For storing image URL
    quizQuestions: [], // For storing quiz questions
    timePerQuestion: "", // For storing time per question
    minimumScore: "", // For storing minimum score
    emailSubject: "", // For storing email subject
    emailDescription: "", // For storing email description
    eventDateTime: "", // For storing event date and time
    eventLocation: "", // For storing event location
    eventDomain: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("authToken");

    axios
      .get(
        `https://event-management-platform.onrender.com/auth/dashboard/data/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        const fetchedData = response.data;
        console.log(fetchedData);
        setData({
          title: fetchedData.title,
          description: fetchedData.description,
          quizQuestions: fetchedData.quizQuestions,
          timePerQuestion: fetchedData.timePerQuestion,
          minimumScore: fetchedData.minimumScore,
          emailSubject: fetchedData.emailSubject,
          emailDescription: fetchedData.emailDescription,
          eventDateTime: fetchedData.eventDateTime,
          eventLocation: fetchedData.eventLocation,
          eventDomain: fetchedData.eventDomain,
        });

        // Fetch and set image URL for the data
        const imgs = await listAll(ref(imageDb, `files/${id}`));
        const urls = await Promise.all(
          imgs.items.map((val) => getDownloadURL(val))
        );

        const imageUrl = urls.length > 0 ? urls[0] : ""; // Assuming there's only one image per data entry
        setData((prevData) => ({ ...prevData, imageUrl }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      if (img) {
        // Delete the existing image in Firebase Storage before uploading the new one
        const userDataResponse = await axios.get(
          `https://event-management-platform.onrender.com/auth/dashboard/data/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = userDataResponse.data;

        if (
          !userData ||
          !userData._id ||
          !userData.imageUrl ||
          userData.imageUrl.length === 0
        ) {
          throw new Error("UserData not found or _id missing");
        }

        const dataId = userData._id;
        const imageID = userData.imageUrl[0];
        const imagePath = `files/${dataId}/${imageID}`; // Adjust the path to suit your structure

        const imageRef = ref(imageDb, imagePath);

        // Delete the existing image file from Firebase Storage
        await deleteObject(imageRef);

        // Upload new image if provided
        const imgRef = ref(imageDb, `files/${id}/${img.name}`);
        await uploadBytes(imgRef, img);
        const imageName = img.name; // Get the image name only

        // Update data with new image name
        setData((prevData) => ({ ...prevData, imageUrl: [imageName] }));
      }

      // Update title, description, and imageUrl in MongoDB
      await axios.put(
        `https://event-management-platform.onrender.com/auth/dashboard/data/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowUpdateSuccessToast(true);
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to the dashboard after 5 seconds
      }, 5000);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleQuizChange = (index, field, value) => {
    // Update quizQuestions in state
    setData((prevData) => {
      const updatedQuestions = [...prevData.quizQuestions];
      updatedQuestions[index][field] = value;
      return { ...prevData, quizQuestions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    // Update options in state
    setData((prevData) => {
      const updatedQuestions = [...prevData.quizQuestions];
      updatedQuestions[questionIndex].options[optionIndex].text = value;
      return { ...prevData, quizQuestions: updatedQuestions };
    });
  };

  const handleCorrectOptionChange = (questionIndex, value) => {
    // Update correct option in state
    setData((prevData) => {
      const updatedQuestions = [...prevData.quizQuestions];
      updatedQuestions[questionIndex].correctOption = value;
      return { ...prevData, quizQuestions: updatedQuestions };
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...data.quizQuestions];
    updatedQuestions.splice(index, 1);
    setData((prevData) => ({ ...prevData, quizQuestions: updatedQuestions }));
  };

  const handleTimePerQuestionChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      timePerQuestion: value,
    }));
  };

  const handleMinimumScoreChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      minimumScore: value,
    }));
  };

  const handleEventDomainChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      eventDomain: value,
    }));
  };

  return (
    <>
      <OrganizerNavbarComponent />
      <br />
      <div className="edit-data-container">
        <h2>Edit Data</h2>
        <br />
        <form onSubmit={handleEdit}>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            required
            className="form-control mb-3"
          ></textarea>
          <h3>Current Image: </h3>
          <br />
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt="Data Image"
              height="200"
              width="200"
            />
          )}
          <br />
          <br />
          <div>
            <label>Upload new Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control mb-3"
            />
          </div>

          {/* Quiz Questions Section */}
          <h3>Quiz Questions</h3>
          {data.quizQuestions.map((question, index) => (
            <div key={index}>
              <label>{`Question ${index + 1}:`}</label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuizChange(index, "questionText", e.target.value)
                }
                required
                className="form-control mb-3"
              />
              {/* Remove Question button */}
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="btn btn-danger mb-3"
              >
                Remove Question
              </button>

              {/* Input fields for options */}
              {[0, 1, 2, 3].map((optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  value={question.options[optionIndex].text}
                  onChange={(e) =>
                    handleOptionChange(index, optionIndex, e.target.value)
                  }
                  placeholder={`Option ${optionIndex + 1}`}
                  className="form-control mb-3"
                />
              ))}

              {/* Input field for correct option */}
              <label>{`Correct Option for Question ${index + 1}:`}</label>
              <input
                type="text"
                value={question.correctOption}
                onChange={(e) =>
                  handleCorrectOptionChange(index, e.target.value)
                }
                placeholder={`Correct Option (1-4)`}
                className="form-control mb-3"
              />
            </div>
          ))}
          <br />

          <label>Time Per Question: </label>
          <input
            type="text"
            name="timePerQuestion"
            value={data.timePerQuestion}
            onChange={handleTimePerQuestionChange}
            required
            className="form-control mb-3"
          />

          <label>Minimum Score : </label>
          <input
            type="text"
            name="minimumScore"
            value={data.minimumScore}
            onChange={handleMinimumScoreChange}
            required
            className="form-control mb-3"
          />

          <label>Event Domain: </label>
          <input
            type="text"
            name="eventDomain"
            value={data.eventDomain}
            onChange={handleEventDomainChange}
            required
            className="form-control mb-3"
          />

          {/* Email Information Section */}
          <h3>Email Information</h3>
          <label>Email Subject:</label>
          <input
            type="text"
            name="emailSubject"
            value={data.emailSubject}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <label>Email Description:</label>
          <textarea
            name="emailDescription"
            value={data.emailDescription}
            onChange={handleChange}
            required
            className="form-control mb-3"
          ></textarea>
          <label>Event Date & Time:</label>
          <input
            type="datetime-local"
            name="eventDateTime"
            value={data.eventDateTime}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <label>Event Location:</label>
          <input
            type="text"
            name="eventLocation"
            value={data.eventLocation}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />

          {/* Button to add a new question set */}
          <button type="submit" className="btn btn-primary">
            Edit
          </button>
        </form>
      </div>
      <Toast
        show={showUpdateSuccessToast}
        onClose={() => setShowUpdateSuccessToast(false)}
        className="custom-toast-message-update-data"
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">EventSphere</strong>
        </Toast.Header>
        <Toast.Body>Data Updated Successfully!</Toast.Body>
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="primary"
            onClick={() => setShowUpdateSuccessToast(false)}
          >
            OK
          </Button>
        </div>
      </Toast>
    </>
  );
};

export default UpdateData;
