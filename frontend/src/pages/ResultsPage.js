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
      console.error("평가 가져오기 오류:", error);
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
    return <div className="loading">평가 결과를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  // 핵심: evaluation이 string(마크다운 전체)일 경우 그대로 렌더링
  return (
    <div className="results-container">
      <h1>면접 평가 결과</h1>
      {evaluation && typeof evaluation === "string" ? (
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {evaluation}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="no-evaluation">
          <p>아직 평가 결과가 없습니다.</p>
        </div>
      )}
      <div className="actions">
        <button onClick={handleDownload}>평가 결과 다운로드</button>
        <button onClick={handleNewInterview}>새 면접 시작하기</button>
      </div>
    </div>
  );
};

export default ResultsPage;
