import { useState, useEffect, useRef } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognizerRef = useRef(null);

  const startListening = () => {
    try {
      setError(null);

      // Azure Speech 서비스 설정
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        process.env.REACT_APP_SPEECH_KEY,
        process.env.REACT_APP_SPEECH_REGION
      );

      speechConfig.speechRecognitionLanguage = "ko-KR";

      // 오디오 설정
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

      // 음성 인식기 생성
      recognizerRef.current = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

      // 인식 중인 텍스트 처리
      recognizerRef.current.recognizing = (s, e) => {
        setTranscript(e.result.text);
      };

      // 인식된 텍스트 처리
      recognizerRef.current.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          setTranscript((prevText) => prevText + " " + e.result.text);
        }
      };

      // 오류 처리
      recognizerRef.current.canceled = (s, e) => {
        setError(`음성 인식 오류: ${e.errorDetails}`);
        stopListening();
      };

      // 연속 인식 시작
      recognizerRef.current.startContinuousRecognitionAsync();

      setIsListening(true);
    } catch (error) {
      setError(
        "음성 인식을 시작할 수 없습니다. 마이크 접근 권한을 확인해주세요."
      );
      console.error("음성 인식 시작 오류:", error);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
      }
    };
  }, []);

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
