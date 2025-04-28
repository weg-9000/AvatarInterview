import React from "react";

const InterviewQuestions = ({ questions, currentIndex }) => {
  return (
    <div className="interview-questions">
      <h3>면접 질문</h3>

      <div className="questions-list">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`question-item ${
              index === currentIndex ? "active" : ""
            } ${index < currentIndex ? "completed" : ""}`}
          >
            <div className="question-number">{index + 1}</div>
            <div className="question-text">{question}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestions;
