import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    companyName: "",
    jobPosition: "", // position에서 jobPosition으로 다시 변경
  });
  // 단일 이력서 텍스트 필드로 변경
  const [resumeContent, setResumeContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    setResumeContent(e.target.value);
  };

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();
    if (!userData.name || !userData.companyName || !userData.jobPosition) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/api/users/create", userData);
      setUserId(response.data.userId);
      localStorage.setItem(
        "companyId",
        userData.companyName.toLowerCase().replace(/\s+/g, "_")
      );
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.error("사용자 정보 저장 오류:", error);
      setError("사용자 정보를 저장하는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleSubmitResume = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // 이력서 전체 텍스트만 저장
      await api.post(`/api/resumes/${userId}/create`, {
        personalInfo: { name: userData.name },
        applicationInfo: {
          company: userData.companyName,
          position: userData.jobPosition, // 필드명 변경
        },
        resumeContent: { resumeContent }, // 단일 필드로 전달
      });
      await api.post("/api/interviews/research", {
        userId,
        companyName: userData.companyName,
        jobPosition: userData.jobPosition, // 필드명 유지
      });
      await api.post("/api/interviews/generate-questions", {
        userId,
        companyId: userData.companyName.toLowerCase().replace(/\s+/g, "_"),
      });
      navigate(`/interview/${userId}`);
      setLoading(false);
    } catch (error) {
      console.error("이력서 저장 오류:", error);
      setError("이력서를 저장하는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="resume-form-container">
      {step === 1 ? (
        <form onSubmit={handleSubmitUserInfo} className="form-container">
          <h2 className="form-title">기본 정보 입력</h2>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">지원 회사</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={userData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobPosition">지원 직무</label>
            <input
              type="text"
              id="jobPosition"
              name="jobPosition"
              value={userData.jobPosition}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "처리 중..." : "다음"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitResume} className="form-container">
          <h2 className="form-title">이력서 전체 작성</h2>
          <div className="form-group full-resume">
            <label htmlFor="resumeContent">이력서 내용</label>
            <textarea
              id="resumeContent"
              name="resumeContent"
              value={resumeContent}
              onChange={handleResumeChange}
              placeholder="귀하의 전체 이력서 내용을 자유롭게 작성해주세요."
              rows={20}
              style={{ minHeight: "400px", fontSize: "1.1rem" }}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "처리 중..." : "면접 시작하기"}
          </button>
        </form>
      )}
    </div>
  );
};

export default HomePage;
