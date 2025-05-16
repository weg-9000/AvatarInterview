import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(""); // 최종 텍스트를 저장하기 위한 ref

  useEffect(() => {
    // 브라우저 지원 확인
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError(
        "이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요."
      );
      return;
    }

    // SpeechRecognition 인스턴스 생성
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    // 설정
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "ko-KR"; // 한국어 설정

    // 이벤트 핸들러
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";

      // 현재 인식 세션의 결과만 처리
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          // 최종 결과는 finalTranscript에 추가
          finalTranscriptRef.current += transcript + " ";
        } else {
          // 중간 결과는 interimTranscript에 추가
          interimTranscript += transcript;
        }
      }

      // 최종 텍스트와 현재 진행 중인 텍스트를 합쳐서 표시
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setError(`음성 인식 오류: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("음성 인식 시작 오류:", error);
        setError("음성 인식을 시작할 수 없습니다.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    finalTranscriptRef.current = ""; // 최종 텍스트도 초기화
  };

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
