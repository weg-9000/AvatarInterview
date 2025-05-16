import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvatarComponent from "components/Avatar/AvatarComponent";
import ResponseRecorder from "components/Interview/ResponseRecorder";
import api from "services/api";

// 이미지 파일 import
import micIcon from "assets/images/mic-icon.png";
import textIcon from "assets/images/text-icon.png";

const InterviewPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMode, setResponseMode] = useState(null); // "text" 또는 "speech"

  useEffect(() => {
    // 면접 질문 가져오기
    fetchQuestions();
  }, [userId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/interviews/questions/${userId}`);
      setQuestions(response.data.questions);
      setLoading(false);

      // 첫 번째 질문 자동 재생 (선택적)
      if (response.data.questions.length > 0) {
        setIsQuestionPlaying(true);
      }
    } catch (error) {
      console.error("질문 가져오기 오류:", error);
      setError("면접 질문을 가져오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleQuestionComplete = () => {
    setIsQuestionPlaying(false);
    setResponseMode(null); // 응답 모드 초기화
    setIsResponding(true);
  };

  const handleResponseModeSelect = (mode) => {
    setResponseMode(mode);
  };

  const handleResponseComplete = (response) => {
    setIsResponding(false);
    setResponseMode(null);

    // 다음 질문으로 이동하거나 면접 완료
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsQuestionPlaying(true);
    } else {
      setIsInterviewComplete(true);
      // 평가 생성 요청
      generateEvaluation();
    }
  };

  const generateEvaluation = async () => {
    try {
      await api.post("/api/evaluations/generate", {
        userId,
        companyId: localStorage.getItem("companyId"),
      });
      // 결과 페이지로 이동
      navigate(`/results/${userId}`);
    } catch (error) {
      console.error("평가 생성 오류:", error);
      setError("면접 평가를 생성하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="loading">면접 준비 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="no-questions">면접 질문이 없습니다.</div>;
  }

  return (
    <div className="interview-page">
      <h1>면접 시뮬레이션</h1>

      <div className="question-display">
        <h2>
          질문 {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p>{questions[currentQuestionIndex]}</p>
      </div>

      <div className="avatar-section">
        <AvatarComponent
          question={isQuestionPlaying ? questions[currentQuestionIndex] : null}
          onQuestionComplete={handleQuestionComplete}
        />
      </div>

      {isResponding && !responseMode && (
        <div className="response-mode-selection">
          <h3>응답 방식을 선택하세요</h3>
          <div className="button-group">
            <button
              className="btn-mode-selection text-mode"
              onClick={() => handleResponseModeSelect("text")}
            >
              <img
                src={textIcon}
                alt="텍스트로 응답하기"
                className="mode-icon"
              />
              <span className="mode-label">텍스트로 응답하기</span>
            </button>
            <button
              className="btn-mode-selection speech-mode"
              onClick={() => handleResponseModeSelect("speech")}
            >
              <img
                src={micIcon}
                alt="음성으로 응답하기"
                className="mode-icon"
              />
              <span className="mode-label">음성으로 응답하기</span>
            </button>
          </div>
        </div>
      )}

      {isResponding && responseMode && (
        <div className="recorder-section">
          <ResponseRecorder
            userId={userId}
            questionId={`q${currentQuestionIndex + 1}`}
            questionText={questions[currentQuestionIndex]}
            onRecordingComplete={handleResponseComplete}
            mode={responseMode}
          />
        </div>
      )}

      {!isQuestionPlaying && !isResponding && !isInterviewComplete && (
        <button
          className="next-question-button"
          onClick={() => setIsQuestionPlaying(true)}
        >
          {currentQuestionIndex === 0 ? "면접 시작" : "다음 질문"}
        </button>
      )}

      {isInterviewComplete && (
        <div className="interview-complete">
          <h2>면접이 완료되었습니다!</h2>
          <p>결과를 분석 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
