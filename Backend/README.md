# 아바타 면접 도우미 - 백엔드

이 프로젝트는 Azure 서비스와 Semantic Kernel을 활용한 다중 에이전트 시스템으로 구현된 면접 준비 애플리케이션의 백엔드입니다.

## 기능

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
  - Azure OpenAI 
  - Azure Speech Service
    
else: -  OpenAI API KEY

### 환경 변수 설정

`.env` 파일을 생성하고 다음과 같이 설정합니다:
# Azure Cosmos DB
COSMOS_DB_ENDPOINT=
COSMOS_DB_KEY=
COSMOS_DB_DATABASE=

# Azure Document Intelligence
DOCUMENT_INTELLIGENCE_ENDPOINT=
DOCUMENT_INTELLIGENCE_KEY=

# Azure OpenAI
PERPLEXITY_ENDPOINT=
PERPLEXITY_API_KEY=
PERPLEXITY_DEPLOYMENT=


# Azure Speech Service
SPEECH_SERVICE_ENDPOINT=
SPEECH_SERVICE_KEY=


# 구조
```
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── company_research_agent.py
│   │   │   ├── interview_question_agent.py
│   │   │   └── evaluation_agent.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── users.py
│   │   │   │   ├── resumes.py
│   │   │   │   ├── interviews.py
│   │   │   │   └── evaluations.py
│   │   │   ├── dependencies.py
│   │   │   └── middleware.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── exceptions.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── cosmos_client.py
│   │   │   └── repositories/
│   │   │       ├── __init__.py
│   │   │       ├── user_repository.py
│   │   │       ├── resume_repository.py
│   │   │       ├── talent_repository.py
│   │   │       ├── question_repository.py
│   │   │       ├── response_repository.py
│   │   │       └── evaluation_repository.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   ├── talent.py
│   │   │   ├── question.py
│   │   │   ├── response.py
│   │   │   └── evaluation.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── resume_processor.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── helpers.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── alembic.ini
│   └── README.md

```



