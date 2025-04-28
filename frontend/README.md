# 아바타 면접 도우미 - 프론트엔드

이 프로젝트는 Azure 서비스와 Semantic Kernel을 활용한 다중 에이전트 시스템으로 구현된 면접 준비 애플리케이션의 프론트엔드입니다.

## 기능

- 사용자 정보 및 이력서 업로드
- 아바타를 통한 면접 시뮬레이션
- 음성 인식을 통한 면접 응답 녹음
- 면접 평가 및 피드백 확인

## 설치 및 실행

### 필수 요구사항

- Node.js 14 이상
- npm 또는 yarn

### 환경 변수 설정

`.env` 파일을 생성하고 다음과 같이 설정합니다:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SPEECH_KEY=
REACT_APP_SPEECH_REGION=
```

# 구조
```
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Avatar/
│   │   │   │   └── AvatarComponent.js
│   │   │   ├── Interview/
│   │   │   │   ├── InterviewQuestions.js
│   │   │   │   ├── ResponseRecorder.js
│   │   │   │   └── Timer.js
│   │   │   ├── Resume/
│   │   │   │   ├── ResumeUploader.js
│   │   │   │   └── ResumeAnalysis.js
│   │   │   ├── Results/
│   │   │   │   ├── EvaluationSummary.js
│   │   │   │   └── ImprovementSuggestions.js
│   │   │   └── common/
│   │   │       ├── Header.js
│   │   │       ├── Footer.js
│   │   │       └── LoadingIndicator.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── InterviewContext.js
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.js
│   │   │   └── useTimer.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── InterviewPage.js
│   │   │   └── ResultsPage.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── speechService.js
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── validators.j
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── package.json
│   └── README.md

```
