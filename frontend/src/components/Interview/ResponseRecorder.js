import React, { useState, useRef } from "react";
import useTimer from "hooks/useTimer";
import api from "services/api";

const ResponseRecorder = ({
  userId,
  questionId,
  questionText,
  onRecordingComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const { time, startTimer, stopTimer, resetTimer } = useTimer(90); // 1분 30초

  // 타이머가 0이 되면 자동 제출
  React.useEffect(() => {
    if (time === 0 && isRecording) {
      handleSubmit();
    }
  }, [time, isRecording]);

  const startInputMode = () => {
    try {
      setError(null);
      setTextInput("");
      setIsRecording(true);
      startTimer();
      // 텍스트 영역에 포커스
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
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
      // 응답 저장
      await saveResponse();
      setIsRecording(false);
      stopTimer();
      resetTimer();
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

  return (
    <div className="response-recorder">
      <div className="timer-display">남은 시간: {time}초</div>

      {!isRecording ? (
        <button className="start-button" onClick={startInputMode}>
          응답 시작하기
        </button>
      ) : (
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={textInput}
            onChange={handleTextChange}
            placeholder="여기에 응답을 입력하세요..."
            rows={6}
            className="response-textarea"
          />
          <button className="submit-button" onClick={handleSubmit}>
            응답 제출하기
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ResponseRecorder;
