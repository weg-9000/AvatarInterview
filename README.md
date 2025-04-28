# 아바타 면접 도우미

Azure 서비스와 Semantic Kernel을 활용한 다중 에이전트 시스템으로 구현된 면접 준비 애플리케이션입니다.

## 프로젝트 개요

이 프로젝트는 사용자의 이력서를 분석하고, 지원 회사의 인재상을 파악하여 맞춤형 면접 질문을 생성하고, 아바타를 통해 실제 면접 환경을 시뮬레이션합니다. 또한 사용자의 응답을 분석하여 종합적인 평가와 개선 제안을 제공합니다.

## 주요 기능

- **이력서 분석**: Azure Document Intelligence를 사용하여 이력서를 자동으로 분석
- **회사 인재상 연구**: 지원 회사와 직무에 맞는 인재상 및 면접 정보 검색
- **맞춤형 면접 질문**: 이력서와 회사 인재상을 바탕으로 개인화된 면접 질문 생성
- **아바타 면접관**: Azure AI Avatar를 사용한 실제 면접관과 같은 경험 제공
- **음성 인식**: 사용자의 응답을 실시간으로 텍스트로 변환
- **면접 평가**: 응답 내용을 분석하여 종합적인 평가와 개선 제안 제공

## 기술 스택

### 백엔드

- FastAPI
- Azure Cosmos DB
- Azure Document Intelligence
- Azure OpenAI
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
