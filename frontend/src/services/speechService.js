import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

class SpeechService {
  constructor() {
    this.speechConfig = null;
    this.recognizer = null;
    this.synthesizer = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Speech 설정
      this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        process.env.REACT_APP_SPEECH_KEY,
        process.env.REACT_APP_SPEECH_REGION
      );

      // 한국어 설정
      this.speechConfig.speechRecognitionLanguage = "ko-KR";
      this.speechConfig.speechSynthesisVoiceName = "ko-KR-SunHiNeural";

      this.isInitialized = true;
    } catch (error) {
      console.error("음성 서비스 초기화 오류:", error);
      throw error;
    }
  }

  async startRecognition(onRecognizing, onRecognized, onError) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // 오디오 설정
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

      // 음성 인식기 생성
      this.recognizer = new SpeechSDK.SpeechRecognizer(
        this.speechConfig,
        audioConfig
      );

      // 인식 중인 텍스트 처리
      this.recognizer.recognizing = (s, e) => {
        if (onRecognizing) {
          onRecognizing(e.result.text);
        }
      };

      // 인식된 텍스트 처리
      this.recognizer.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          if (onRecognized) {
            onRecognized(e.result.text);
          }
        }
      };

      // 오류 처리
      this.recognizer.canceled = (s, e) => {
        if (onError) {
          onError(`음성 인식 오류: ${e.errorDetails}`);
        }
      };

      // 연속 인식 시작
      await this.recognizer.startContinuousRecognitionAsync();

      return true;
    } catch (error) {
      console.error("음성 인식 시작 오류:", error);
      throw error;
    }
  }

  async stopRecognition() {
    if (this.recognizer) {
      try {
        await this.recognizer.stopContinuousRecognitionAsync();
        this.recognizer.close();
        this.recognizer = null;
        return true;
      } catch (error) {
        console.error("음성 인식 중지 오류:", error);
        throw error;
      }
    }
    return false;
  }

  async synthesizeSpeech(text) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // 오디오 출력 설정
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

      // 음성 합성기 생성
      this.synthesizer = new SpeechSDK.SpeechSynthesizer(
        this.speechConfig,
        audioConfig
      );

      // 텍스트를 음성으로 변환
      const result = await this.synthesizer.speakTextAsync(text);

      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        return { success: true };
      } else {
        return {
          success: false,
          error: `음성 합성 실패: ${result.reason}`,
        };
      }
    } catch (error) {
      console.error("음성 합성 오류:", error);
      throw error;
    } finally {
      if (this.synthesizer) {
        this.synthesizer.close();
        this.synthesizer = null;
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const speechService = new SpeechService();

export default speechService;
