import React, { useState, useRef, useEffect } from "react";
import api from "services/api";
import useSpeechRecognition from "hooks/useSpeechRecognition";

const ResponseRecorder = ({
  userId,
  questionId,
  questionText,
  onRecordingComplete,
  mode,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90); // 1분 30초
  const textareaRef = useRef(null);
  const timerRef = useRef(null);

  // 음성 인식 훅 사용
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition();

  // 컴포넌트 마운트 시 녹음 시작
  useEffect(() => {
    startRecording();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mode === "speech" && isListening) {
        stopListening();
      }
    };
  }, []);

  // 음성 인식 결과를 textInput에 반영
  useEffect(() => {
    if (mode === "speech" && transcript) {
      setTextInput(transcript);
    }
  }, [transcript, mode]);

  // 타이머 효과
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // 음성 인식 오류 처리
  useEffect(() => {
    if (speechError && mode === "speech") {
      setError(`음성 인식 오류: ${speechError}`);
    }
  }, [speechError, mode]);

  const startRecording = () => {
    try {
      setError(null);
      setIsRecording(true);

      if (mode === "text") {
        // 텍스트 영역에 포커스
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }, 100);
      } else if (mode === "speech") {
        // 음성 인식 시작
        resetTranscript();
        startListening();
      }
    } catch (error) {
      console.error("응답 시작 오류:", error);
      setError("응답을 시작할 수 없습니다.");
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!isRecording) return;

    try {
      // 음성 인식 중이면 중지
      if (mode === "speech" && isListening) {
        stopListening();
      }

      // 타이머 중지
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 응답 저장
      await saveResponse();
      setIsRecording(false);

      // 부모 컴포넌트에 완료 알림
      onRecordingComplete(textInput);
    } catch (error) {
      console.error("응답 제출 오류:", error);
      setError("응답을 제출하는 중 오류가 발생했습니다.");
    }
  };

  const saveResponse = async () => {
    try {
      await api.post("/api/interviews/save-response", {
        userId,
        questionId,
        questionText,
        answerText: textInput,
      });
      console.log("응답이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("응답 저장 오류:", error);
      setError("응답을 저장하는 중 오류가 발생했습니다.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="response-recorder">
      <div className="timer">남은 시간: {formatTime(timeLeft)}</div>

      {mode === "text" ? (
        <div className="text-input-container">
          <textarea
            ref={textareaRef}
            value={textInput}
            onChange={handleTextChange}
            placeholder="여기에 응답을 입력하세요..."
            className="response-textarea"
          />
        </div>
      ) : (
        <div className="speech-input-container">
          <div className="transcript-display">
            {textInput || "말씀하신 내용이 여기에 표시됩니다..."}
          </div>
          <div className="speech-status">
            {isListening
              ? "음성 인식 중..."
              : "음성 인식이 일시 중지되었습니다"}
          </div>
          <button
            className={`btn ${isListening ? "btn-danger" : "btn-success"}`}
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
          >
            {isListening ? "일시 중지" : "계속하기"}
          </button>
        </div>
      )}

      <div className="button-container">
        <button className="btn btn-primary" onClick={handleSubmit}>
          응답 제출
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ResponseRecorder;
