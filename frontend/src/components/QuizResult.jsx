import React, { useState } from "react";

export default function QuizResult({
  resultData,
  hideStartNew = false,
  onStartNew,
}) {
  const [loading, setLoading] = useState(false);
  console.log("resultData", resultData);
  const onClickStartNew = async () => {
    setLoading(true);
    try {
      await onStartNew();
    } finally {
      setLoading(false);
    }
  };
  if (!resultData) return null;

  return (
    <div className="mx-auto max-w-4xl p-8 sm:p-10 border rounded-2xl shadow-xl bg-white space-y-8">
      <h1 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 0v4m0-4h4m-4 0H8"
          />
        </svg>
        Quiz Results
      </h1>

      {/* quizScore */}
      <div className="text-center space-y-4">
        <h3 className="text-6xl font-semibold text-gray-900">
          {resultData.quizScore.toFixed(1)}%
        </h3>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              resultData.quizScore >= 70 ? "bg-green-600" : "bg-red-600"
            }`}
            style={{ width: `${resultData.quizScore}%` }}
          ></div>
        </div>
      </div>

      {/* Improvement Tip */}
      {resultData.improvementTip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-lg shadow-md">
          <p className="font-medium text-yellow-800">Improvement Tip:</p>
          <p className="text-sm text-yellow-700">
            The result improvement tips is: {resultData.improvementTip}
          </p>
        </div>
      )}

      {/* Question Review */}
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">
          Question Review
        </h3>
        {resultData.questions.map((q, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border transition-all duration-300 ${
              q.isCorrect
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium text-gray-800 text-lg">{q.question}</p>
              <span
                className={`text-xl font-bold ${
                  q.isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {q.isCorrect ? "✔️" : "❌"}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <p>
                <span className="font-medium">Your Answer:</span> {q.userAnswer}
              </p>
              {!q.isCorrect && (
                <p>
                  <span className="font-medium">Correct Answer:</span>{" "}
                  {q.correctAnswer}
                </p>
              )}
            </div>
            <div className="text-sm bg-gray-100 p-5 rounded-md">
              <p className="font-medium text-gray-700 mb-1">Explanation:</p>
              <p className="text-gray-800">
                {q.explanation?.trim()
                  ? q.explanation
                  : "No explanation provided for this question."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Retry Button */}
      {!hideStartNew && (
        <div>
          {/* <button
            onClick={onStartNew}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition duration-300"
          >
            Start New Quiz
          </button> */}
          <button
            onClick={onClickStartNew}
            disabled={loading}
            className="relative bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Generating New Quiz...
              </div>
            ) : (
              "Start Quiz"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
