"use client";

import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuizResult from "./QuizResult";
import axios from "axios";
import { AppContext } from "../context/appContext";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { backendUrl, userToken, user, fetchAssessments } =
    useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (resultData) {
      console.log("Updated resultData:", resultData);
    }
  }, [resultData]);
  const startQuiz = async () => {
    setLoading(true);
    try {
      await fetchQuiz();
      setAnswers(new Array(10).fill(null));
      setCurrentQuestion(0);
      setShowExplanation(false);
      setResultData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/ai/generate-quiz`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (data.success) {
        setQuizData(data.questions);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch quiz.");
    }
  };

  const saveQuizResult = async () => {
    const score = calculateScore();
    const questions = quizData.map((q, i) => ({
      question: q.question,
      userAnswer: answers[i],
      answer: q.correctAnswer,
      explanation: q.explanation,
      isCorrect: answers[i] === q.correctAnswer,
    }));
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/ai/save-quiz-result`,
        {
          score,
          questions,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (data.success) {
        setResultData(data.assessment);
        console.log(resultData);
        console.log("results saved to database succesfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save result to database.");
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((ans, i) => {
      if (ans === quizData[i].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);
    await saveQuizResult();
    toast.success("Quiz Completed!");
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const question = quizData?.[currentQuestion];

  if (resultData) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <QuizResult resultData={resultData} onStartNew={startQuiz} />
        <ToastContainer />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border border-gray-100 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center bg-white p-3 rounded-full shadow-sm mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Challenge Your Technical Knowledge
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Receive 10 personalized questions matching your industry expertise
            and skill level.
          </p>
        </div>

        <button
          onClick={startQuiz}
          disabled={loading}
          className="relative group cursor-pointer inline-flex items-center justify-center w-full max-w-xs mx-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Crafting Your Challenge...
            </span>
          ) : (
            <>
              <span className="relative z-10">Start Knowledge Challenge</span>
              <span className="absolute right-6 group-hover:right-5 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </>
          )}
        </button>

        <div className="mt-6 text-sm text-gray-500 flex items-center justify-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Questions adapt to your responses</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          Question {currentQuestion + 1} of {quizData.length}
        </h2>
        <p className="text-lg sm:text-xl text-gray-700">{question.question}</p>
      </div>

      <div className="space-y-4 mb-6">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`block p-2 border rounded-lg cursor-pointer transition text-gray-800 ${
              answers[currentQuestion] === option
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              name={`question-${currentQuestion}`}
              value={option}
              checked={answers[currentQuestion] === option}
              onChange={() => handleAnswer(option)}
            />
            {option}
          </label>
        ))}
      </div>

      {showExplanation && question.explanation && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-300 mb-6">
          <p className="font-semibold text-yellow-800 mb-1">Explanation:</p>
          <p className="text-yellow-700 text-sm">{question.explanation}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {!showExplanation && (
          <button
            onClick={() => setShowExplanation(true)}
            disabled={!answers[currentQuestion]}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
          >
            Show Explanation
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 ml-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : currentQuestion < quizData.length - 1 ? (
            "Next Question"
          ) : (
            "Finish Quiz"
          )}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
