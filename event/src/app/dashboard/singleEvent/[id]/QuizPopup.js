'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './QuizPopup.css';
import axios from 'axios';

const QuizPopup = () => {
  const [quizData, setQuizData] = useState({
    quizQuestions: [],
    timePerQuestion: 0,
    minimumScore: 0,
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Store user's selected options
  const questionIndexRef = useRef(0);
  const { id } = useParams();

  const router = useRouter();

  useEffect(() => {
    // Fetch quiz questions and timePerQuestion from MongoDB
    const token = localStorage.getItem('authToken');

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`https://event-management-platform.onrender.com/auth/dashboard/data/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { quizQuestions, timePerQuestion, minimumScore } = response.data;

        setQuizData({
          quizQuestions: quizQuestions || [],
          timePerQuestion: timePerQuestion || 0,
          minimumScore: minimumScore || 0,
        });
        setRemainingTime(timePerQuestion || 0);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        // Handle error fetching data
      }
    };

    fetchQuizData();
  }, [id]);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleOptionSelect = (selectedOption) => {
    // Update the user's selected options
    setUserAnswers((prevAnswers) => [...prevAnswers, selectedOption]);
  };

  useEffect(() => {
    let timer;
    if (showQuiz && questionIndexRef.current <= quizData.quizQuestions.length && !quizOver) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);

            if (questionIndexRef.current === quizData.quizQuestions.length) {
              // Last question set, end the quiz
              setQuizOver(true);
            } else {
              // Move to the next question set without skipping any
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

  // Calculate the user's score
  const calculateScore = () => {
    let correctAnswers = 0;

    quizData.quizQuestions.forEach((question, index) => {
      const correctOption = question.correctOption - 1; // Convert to 0-based index
      const userAnswer = userAnswers[index];

      if (userAnswer === correctOption) {
        correctAnswers += 1;
      }
    });

    const score = ((correctAnswers / quizData.quizQuestions.length) * 100).toFixed(2);
    return score;
  };

  return (
    <div className="quiz-popup">
      <div className="quiz-content">
        {!showQuiz ? (
          <>
            <h3 className='confirm-heading'>Are you ready to take the test?</h3><br/>
            <button className='confirm-button' onClick={handleStartQuiz}>Yes</button>
          </>
        ) : (
          <>
            {!quizOver ? (
              <>
                <div className="timer">
                  <p>Time Remaining: {remainingTime} seconds</p>
                </div>
                {/* Add Quiz Questions Section */}
                <div className='quizQuestion-box' key={currentQuestionIndex}>
                  <label className='quizQuestion-Number'>{`Question ${currentQuestionIndex + 1}:`}</label>
                  <br/><br/>
                  <p className='quizQuestion-Heading'>{quizData.quizQuestions[currentQuestionIndex]?.questionText}</p>

                  <br/>
                  {/* Display options */}
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
                      <label htmlFor={`question-${currentQuestionIndex}-option-${optionIndex}`}>
                        {quizData.quizQuestions[currentQuestionIndex]?.options[optionIndex].text}
                      </label>
                      <br/>
                      <br/>
                    </div>
                  ))}
                  <br />
                </div>
              </>
            ) : (
              <>
                <p>Test Over</p>
                <br/>
                <p className='test-score'>Your Score: {calculateScore()}%</p>
                {/* MinimumScore comparison */}
                {quizData.minimumScore && (
                  <>
                    {calculateScore() >= parseFloat(quizData.minimumScore) ? (
                      <p className='eligibility-message'>User is eligible to attend the event</p>
                    ) : (
                      <p className='eligibility-message'>User not eligible to attend the event</p>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPopup;
