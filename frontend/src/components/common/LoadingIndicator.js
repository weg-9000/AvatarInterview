import React from "react";

const LoadingIndicator = ({ message = "로딩 중..." }) => {
  return (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingIndicator;
