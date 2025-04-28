import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingIndicator from "components/common/LoadingIndicator";
import api from "services/api";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeContent, setResumeContent] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userResponse = await api.get(`/api/users/${userId}`);
      setUser(userResponse.data);
      try {
        const resumeResponse = await api.get(`/api/resumes/${userId}`);
        setResume(resumeResponse.data);
        setResumeContent(
          resumeResponse.data.resumeContent?.resumeContent || ""
        );
      } catch (resumeError) {
        if (resumeError.response?.status !== 404) throw resumeError;
      }
      setIsLoading(false);
    } catch (error) {
      console.error("사용자 데이터 가져오기 오류:", error);
      setError("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    setResumeContent(e.target.value);
  };

  const handleSaveResume = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await api.post(`/api/resumes/${userId}/create`, {
        personalInfo: { name: user.name },
        applicationInfo: {
          company: user.companyName,
          position: user.jobPosition,
        },
        resumeContent: { resumeContent }, // 단일 필드로 전달
      });
      await fetchUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("이력서 저장 오류:", error);
      setError("이력서를 저장하는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      if (user) {
        await api.post("/api/interviews/research", {
          userId,
          companyName: user.companyName,
          jobPosition: user.jobPosition,
        });
        await api.post("/api/interviews/generate-questions", {
          userId,
          companyId: user.companyName.toLowerCase().replace(" ", "_"),
        });
        navigate(`/interview/${userId}`);
      }
    } catch (error) {
      console.error("면접 준비 오류:", error);
      setError("면접 준비 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  if (isLoading && !resume) {
    return <LoadingIndicator message="사용자 정보를 불러오는 중..." />;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>프로필 정보</h1>
      {user && (
        <div className="user-info">
          <h2>{user.name}님의 정보</h2>
          <p>
            <strong>지원 회사:</strong> {user.companyName}
          </p>
          <p>
            <strong>지원 직무:</strong> {user.jobPosition}
          </p>
        </div>
      )}
      {resume ? (
        <div className="resume-info">
          <h2>이력서</h2>
          {isEditing ? (
            <div className="resume-edit-form">
              <textarea
                value={resumeContent}
                onChange={handleResumeChange}
                rows={20}
                style={{
                  minHeight: "400px",
                  width: "100%",
                  fontSize: "1.1rem",
                }}
              />
              <div className="button-group">
                <button onClick={handleSaveResume} disabled={isLoading}>
                  {isLoading ? "저장 중..." : "저장하기"}
                </button>
                <button onClick={() => setIsEditing(false)}>취소</button>
              </div>
            </div>
          ) : (
            <div className="resume-display">
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "24px",
                  borderRadius: "8px",
                  fontSize: "1.05rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {resumeContent}
              </pre>
              <div className="button-group">
                <button onClick={() => setIsEditing(true)}>이력서 수정</button>
                <button onClick={handleStartInterview} disabled={isLoading}>
                  {isLoading ? "준비 중..." : "면접 시작하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-resume">
          <p>등록된 이력서가 없습니다. 이력서를 작성해주세요.</p>
          <button onClick={() => setIsEditing(true)}>이력서 작성하기</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
