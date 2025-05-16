import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate("/home"); // HomePage로 이동
  };

  const handlePositionSelect = (index) => {
    // 각 포지션에 따른 정보
    const positions = [
      { title: "프론트엔드 개발자", company: "IT 기업" },
      { title: "백엔드 개발자", company: "스타트업" },
      { title: "데이터 사이언티스트", company: "대기업" },
    ];

    // 선택한 포지션 정보 localStorage에 저장
    localStorage.setItem("selectedPosition", JSON.stringify(positions[index]));

    // HomePage로 이동
    navigate("/home");
  };

  return (
    <main className="main-container">
      <h1 className="main-title">AI 면접 코칭 시스템</h1>
      <p className="main-subtitle">
        면접 예상 질문부터 답변 피드백까지, AI가 도와드립니다
      </p>

      <div className="start-interview-container">
        <button onClick={handleStartInterview} className="button">
          면접 시작하기
        </button>
      </div>

      <div className="interview-container">
        <h2>면접 포지션을 선택해보세요</h2>

        <div className="position-cards">
          <div className="position-card">
            <p className="company-name">IT 기업</p>
            <h3 className="position-title">프론트엔드 개발자</h3>
            <span className="position-label">기술 면접</span>
            <button
              className="button-secondary position-button"
              onClick={() => handlePositionSelect(0)}
            >
              <span>면접 시작하기</span>
            </button>
          </div>

          <div className="position-card">
            <p className="company-name">스타트업</p>
            <h3 className="position-title">백엔드 개발자</h3>
            <span className="position-label">기술 면접</span>
            <button
              className="button-secondary position-button"
              onClick={() => handlePositionSelect(1)}
            >
              <span>면접 시작하기</span>
            </button>
          </div>

          <div className="position-card">
            <p className="company-name">대기업</p>
            <h3 className="position-title">데이터 사이언티스트</h3>
            <span className="position-label">기술 면접</span>
            <button
              className="button-secondary position-button"
              onClick={() => handlePositionSelect(2)}
            >
              <span>면접 시작하기</span>
            </button>
          </div>
        </div>

        <div className="question-display" style={{ marginTop: "60px" }}>
          <h2>면접 질문 예시</h2>
          <p>
            React에서 상태 관리를 어떻게 하시나요? 프로젝트에서 사용해본 상태
            관리 라이브러리가 있다면 설명해주세요.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
