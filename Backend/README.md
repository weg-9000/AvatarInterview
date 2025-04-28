# 아바타 면접 도우미 - 백엔드

이 프로젝트는 Azure 서비스와 Semantic Kernel을 활용한 다중 에이전트 시스템으로 구현된 면접 준비 애플리케이션의 백엔드입니다.

## 기능

- 이력서 분석 (Azure Document Intelligence)
- 회사 인재상 및 직무 정보 검색
- 맞춤형 면접 질문 생성
- 음성 인식 및 합성 (Azure Speech Service)
- 아바타 면접관 (Azure AI Avatar)
- 면접 평가 및 피드백 제공

## 설치 및 실행

### 필수 요구사항

- Python 3.8 이상
- Azure 계정 및 필요한 서비스 설정
  - Azure Cosmos DB
  - Azure Document Intelligence
  - Azure OpenAI
  - Azure Speech Service

### 환경 변수 설정

`.env` 파일을 생성하고 다음과 같이 설정합니다:
