# 아바타 면접 도우미
<p align="center">
  <img src="https://github.com/weg-9000/image/blob/main/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-04-29%20153209.png" alt="Example Image">
</p>

Azure 서비스와 Semantic Kernel을 활용한 다중 에이전트 시스템으로 구현된 면접 준비 애플리케이션입니다.

## 프로젝트 개요

이 프로젝트는 사용자의 이력서를 분석하고, 지원 회사의 인재상을 파악하여 맞춤형 면접 질문을 생성하고, 아바타를 통해 실제 면접 환경을 시뮬레이션합니다. 또한 사용자의 응답을 분석하여 종합적인 평가와 개선 제안을 제공합니다.

## 주요 기능

- **이력서 입력**:  사용저가 이력서 전체를 입력
- **회사 인재상 연구**: 지원 회사와 직무에 맞는 인재상 및 면접 정보 검색
- **맞춤형 면접 질문**: 이력서와 회사 인재상을 바탕으로 개인화된 면접 질문 생성
- **아바타 면접관**: Azure AI Avatar를 사용한 실제 면접관과 같은 경험 제공
- **음성 인식**: 사용자의 응답을 실시간으로 텍스트로 변환
- **면접 평가**: 응답 내용을 분석하여 종합적인 평가와 개선 제안 제공

<p align="center">
  <img src="https://github.com/weg-9000/image/blob/main/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-04-29%20153824.png" alt="Example Image">
</p>

## 기술 스택

### 백엔드

- FastAPI
- Azure Cosmos DB
- OpenAI API KEY
- Azure Speech Service
- Semantic Kernel

### 프론트엔드

- React
- React Router
- Azure Cognitive Services Speech SDK
- Axios

## 설치 및 실행

### 필수 요구사항

- Python 3.8 이상
- Node.js 14 이상
- Azure 계정 및 필요한 서비스 설정
- OpenAI 관련 서비스 구독 후 API KEY 생성 (해당 프로젝트는 Perplexity 사용)




```
interview-assistant/
├── frontend/
├── backend/
├── .env
├── .gitignore
├── Docker-compose.yml
└── README.md
```
