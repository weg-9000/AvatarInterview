import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "services/api";

const ResultsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvaluation();
    // eslint-disable-next-line
  }, [userId]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/evaluations/${userId}`);
      setEvaluation(response.data.evaluation);
      setLoading(false);
    } catch (error) {
      setError("면접 평가를 가져오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        typeof evaluation === "string"
          ? evaluation
          : JSON.stringify(evaluation, null, 2),
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `면접평가_${userId}_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleNewInterview = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="results-page">
        <div
          className="evaluation-content"
          style={{ textAlign: "center", color: "#767676" }}
        >
          평가 결과를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <div
          className="evaluation-content"
          style={{
            color: "#fe415c",
            background: "rgba(254,65,92,0.07)",
            borderRadius: "6px",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="results-page">
        <div
          className="evaluation-content"
          style={{ textAlign: "center", color: "#767676" }}
        >
          아직 평가 결과가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <h1>면접 평가 결과</h1>
      <div className="results-summary">
        <ReactMarkdown
          className="evaluation-content"
          remarkPlugins={[remarkGfm]}
        >
          {typeof evaluation === "string"
            ? evaluation
            : JSON.stringify(evaluation, null, 2)}
        </ReactMarkdown>
      </div>
      <div className="action-buttons">
        <button className="action-button" onClick={handleDownload}>
          결과 다운로드
        </button>
        <button
          className="action-button"
          style={{
            background: "#fff",
            color: "#3366ff",
            border: "1px solid #3366ff",
          }}
          onClick={handleNewInterview}
        >
          새 면접 시작
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
