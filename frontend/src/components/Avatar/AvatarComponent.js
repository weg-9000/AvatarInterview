import React, { useEffect, useRef, useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const AvatarComponent = ({ question, onQuestionComplete }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null); // 오디오 요소 추가
  const peerConnectionRef = useRef(null);
  const avatarSynthesizerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 아바타 초기화
    initializeAvatar();
    // 언마운트 시 정리
    return () => {
      if (avatarSynthesizerRef.current) avatarSynthesizerRef.current.close();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // 질문이 변경될 때마다 아바타가 말하도록 설정
    if (question && isReady && !isPlaying) {
      speakQuestion(question);
    }
    // eslint-disable-next-line
  }, [question, isReady]);

  const initializeAvatar = async () => {
    try {
      // Azure Speech 서비스 설정
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        process.env.REACT_APP_SPEECH_KEY,
        process.env.REACT_APP_SPEECH_REGION
      );
      speechConfig.speechSynthesisVoiceName = "ko-KR-SunHiNeural";

      const avatarCharacter = "Meg";
      const avatarStyle = "business";
      const avatarBgColor = "#FFFFFFFF";

      // AvatarConfig 객체 생성
      const avatarConfig = new SpeechSDK.AvatarConfig(
        avatarCharacter,
        avatarStyle,
        avatarBgColor
      );

      // ICE 서버 정보 가져오기
      const response = await fetch(
        `https://${process.env.REACT_APP_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.REACT_APP_SPEECH_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `ICE 서버 정보를 가져오지 못했습니다: 상태 코드 ${response.status}`
        );
      }
      const iceData = await response.json();

      // ICE 서버 정보 처리
      let iceServersConfig = [];
      if (iceData.iceServers && Array.isArray(iceData.iceServers)) {
        iceServersConfig = iceData.iceServers;
      } else if (iceData.Urls) {
        iceServersConfig = [
          {
            urls: Array.isArray(iceData.Urls) ? iceData.Urls : [iceData.Urls],
            username: iceData.Username || "",
            credential: iceData.Password || "",
          },
        ];
      } else if (iceData.urls) {
        iceServersConfig = [
          {
            urls: Array.isArray(iceData.urls) ? iceData.urls : [iceData.urls],
            username: iceData.username || "",
            credential: iceData.credential || "",
          },
        ];
      } else {
        iceServersConfig = [
          {
            urls: ["turn:relay.communication.microsoft.com:3478"],
            username: "",
            credential: "",
          },
        ];
      }

      // WebRTC 피어 연결 설정
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: iceServersConfig,
      });

      // 트랜시버 추가
      peerConnectionRef.current.addTransceiver("video", {
        direction: "sendrecv",
      });
      peerConnectionRef.current.addTransceiver("audio", {
        direction: "sendrecv",
      });

      // 비디오/오디오 트랙 처리
      peerConnectionRef.current.ontrack = (event) => {
        if (event.track.kind === "video" && videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.onplaying = () => {
            // 콘솔 로그 등 필요시 추가
          };
        } else if (event.track.kind === "audio" && audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
          // 자동재생 정책 우회
          audioRef.current.play().catch((e) => {
            // 사용자의 상호작용 후 재생 필요할 수 있음
            console.warn("오디오 자동재생 차단:", e);
          });
        }
      };

      // 아바타 합성기 생성
      avatarSynthesizerRef.current = new SpeechSDK.AvatarSynthesizer(
        speechConfig,
        avatarConfig
      );

      // 아바타 시작
      const result = await avatarSynthesizerRef.current.startAvatarAsync(
        peerConnectionRef.current
      );
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        setIsReady(true);
      } else {
        throw new Error("아바타를 시작할 수 없습니다.");
      }
    } catch (error) {
      console.error("아바타 초기화 오류:", error);
    }
  };

  const speakQuestion = async (text) => {
    if (!avatarSynthesizerRef.current || !text) return;
    try {
      setIsPlaying(true);
      // SSML 생성
      const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">
          <voice name="ko-KR-SunHiNeural">
            ${text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;")
              .replace(
                /\*\*([^*]+)\*\*/g,
                '<emphasis level="strong">$1</emphasis>'
              )}
            </voice> 
        </speak>
      `;
      const result = await avatarSynthesizerRef.current.speakSsmlAsync(ssml);
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        if (onQuestionComplete) onQuestionComplete();
      }
    } catch (error) {
      console.error("질문 재생 오류:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="avatar-container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="avatar-video"
        style={{
          width: "220px",
          height: "320px",
          objectFit: "cover",
          borderRadius: "16px",
          background: "#000",
        }}
      />
      {/* 오디오 트랙 재생용 오디오 요소 */}
      <audio ref={audioRef} autoPlay style={{ display: "none" }} />
    </div>
  );
};

export default AvatarComponent;
