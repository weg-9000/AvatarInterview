import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // CORS 요청에서 credentials 비활성화
});

export const saveResumeData = async (resumeData) => {
  try {
    const response = await fetch("/api/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("이력서 저장 중 오류 발생:", error);
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    console.log(
      `Sending ${config.method.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 오류 응답 처리
    console.error("API 오류:", error.response || error);

    // 오류 메시지 추출
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "서버와 통신 중 오류가 발생했습니다.";

    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
