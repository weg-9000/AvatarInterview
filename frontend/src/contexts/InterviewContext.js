import React, { createContext, useState, useContext } from "react";

// 컨텍스트 생성
const InterviewContext = createContext();

// 컨텍스트 제공자 컴포넌트
export const InterviewProvider = ({ children }) => {
  const [interviewData, setInterviewData] = useState({
    userId: null,
    companyName: "",
    jobPosition: "",
    questions: [],
    currentQuestionIndex: 0,
    responses: [],
    evaluation: null,
    isComplete: false,
  });

  // 사용자 정보 설정
  const setUserInfo = (userId, companyName, jobPosition) => {
    setInterviewData((prev) => ({
      ...prev,
      userId,
      companyName,
      jobPosition,
    }));
  };

  // 질문 설정
  const setQuestions = (questions) => {
    setInterviewData((prev) => ({
      ...prev,
      questions,
      currentQuestionIndex: 0,
    }));
  };

  // 다음 질문으로 이동
  const nextQuestion = () => {
    if (
      interviewData.currentQuestionIndex <
      interviewData.questions.length - 1
    ) {
      setInterviewData((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      return true;
    }
    return false;
  };

  // 응답 추가
  const addResponse = (questionIndex, response) => {
    setInterviewData((prev) => {
      const newResponses = [...prev.responses];
      newResponses[questionIndex] = response;

      return {
        ...prev,
        responses: newResponses,
      };
    });
  };

  // 평가 설정
  const setEvaluation = (evaluation) => {
    setInterviewData((prev) => ({
      ...prev,
      evaluation,
      isComplete: true,
    }));
  };

  // 면접 초기화
  const resetInterview = () => {
    setInterviewData({
      userId: null,
      companyName: "",
      jobPosition: "",
      questions: [],
      currentQuestionIndex: 0,
      responses: [],
      evaluation: null,
      isComplete: false,
    });
  };

  // 컨텍스트 값
  const value = {
    interviewData,
    setUserInfo,
    setQuestions,
    nextQuestion,
    addResponse,
    setEvaluation,
    resetInterview,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

// 커스텀 훅
export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  return context;
};
