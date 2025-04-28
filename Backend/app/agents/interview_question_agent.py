import semantic_kernel as sk
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.contents.chat_message_content import ChatMessageContent
from semantic_kernel.contents.utils.author_role import AuthorRole
from semantic_kernel.functions.kernel_arguments import KernelArguments
from datetime import datetime
from app.core.config import settings
from app.db.repositories.question_repository import QuestionRepository
from app.db.repositories.resume_repository import ResumeRepository
from app.db.repositories.talent_repository import TalentRepository
from openai import AsyncOpenAI
import re


custom_client = AsyncOpenAI(
    api_key=settings.PERPLEXITY_API_KEY,
    base_url=settings.PERPLEXITY_ENDPOINT
)

class InterviewQuestionAgent:
    def __init__(self):
        # Semantic Kernel 초기화
        self.kernel = sk.Kernel()
        
        # Azure OpenAI 서비스 설정
        service_id = "question_generator"
        self.kernel.add_service(
            OpenAIChatCompletion(
                service_id=service_id,
                ai_model_id=settings.PERPLEXITY_DEPLOYMENT,
                api_key=settings.PERPLEXITY_API_KEY,
                async_client=custom_client
            )
        )
        
        # 함수 자동 실행 설정
        settings_obj = self.kernel.get_prompt_execution_settings_from_service_id(service_id=service_id)
        settings_obj.function_choice_behavior = FunctionChoiceBehavior.Auto()
        
        # ChatCompletionAgent 생성
        self.agent = ChatCompletionAgent(
            kernel=self.kernel,
            name="InterviewQuestionAgent",
            instructions="""
            당신은 면접 질문 전문가입니다. 지원자의 이력서와 회사의 인재상을 분석하여 적절한 면접 질문을 생성하는 것이 당신의 임무입니다.
            
            다음 기준에 따라 질문을 생성하세요:
            1. 지원자의 경험과 기술에 맞춘 질문
            2. 회사의 인재상과 직무 요구사항을 반영한 질문
            3. 지원자의 적합성을 평가할 수 있는 질문
            4. 지원자의 문제 해결 능력과 사고 과정을 파악할 수 있는 질문
            
            총 3개의 질문을 생성하세요. 각 질문은 명확하고 구체적이어야 합니다.
            응답 생성 시에 응답에 대한 설명을 절대 하지 않도록하고 오직 3개의 질문만을 생성합니다!
            예시:
            1. 이전 프로젝트에서 WebRTC를 활용한 실시간 통신 구현 시 발생한 가장 큰 기술적 문제는 무엇이었으며, 어떻게 해결하셨나요?

            2. 복잡한 JavaScript 코드베이스에서 버그를 발견했을 때, 문제를 식별하고 해결하기 위한 당신만의 디버깅 프로세스를 설명해주세요.

            3. 팀 내에서 기술적 의견 충돌이 있었던 상황을 예로 들어, 어떻게 합의점을 찾아 프로젝트를 성공적으로 진행했는지 설명해주세요.
            다음 예시는 참고용으로써 질문의 형성의 형식과 어투만 참고한다. 예시의 내용은 참고하지 않는다.
            """,
            arguments=KernelArguments(settings=settings_obj)
        )
        
        # 리포지토리 초기화
        self.question_repository = QuestionRepository()
        self.resume_repository = ResumeRepository()
        self.talent_repository = TalentRepository()
    
    async def generate_questions(self, user_id, company_id):
        try:
            # 이력서 데이터 가져오기
            resume_data = await self.resume_repository.get_resume_by_user_id(user_id)
            
            # 인재상 데이터 가져오기
            talent_data = await self.talent_repository.get_talent_ideal_by_company(company_id)
            
            # 채팅 히스토리 생성
            history = ChatHistory()
            
            
            # 사용자 메시지 추가
            history.add_message(
                ChatMessageContent(
                    role=AuthorRole.USER, 
                    content=f"""
                    ## 이력서 정보 
                    {resume_data['resumeContent']['resumeContent']}
                    
                    ## 회사 인재상 및 직무 정보
                    {talent_data['talentIdeal']}
                    """
                )
            )
            
            #응답 생성성
            response_text = ""
            async for response in self.agent.invoke(messages=history):
                response_text += str(response.content)
            
            # 질문 파싱 (응답에서 질문 3개 추출)
            questions = self._parse_questions(response_text)
            
            # 결과를 데이터베이스에 저장
            question_data = {
                "userId": user_id,
                "companyId": company_id,
                "questions": questions,
                "createdAt": str(datetime.utcnow())
            }
            
            await self.question_repository.create_questions(question_data)
            
            return questions
        except Exception as e:
            print(f"면접 질문 생성 에이전트 오류: {str(e)}")
            raise
    
    def _parse_questions(self, response):
       
        pattern = re.compile(r'^\s*\d+\.\s*(.+)', re.MULTILINE)
        questions = [match.group(1).strip() for match in pattern.finditer(response)]

        if not questions:
            lines = response.split('\n')
            for line in lines:
                line = line.strip()
                if line and (line.endswith('?') or '질문' in line):
                    cleaned_line = re.sub(r'^\d+\.?\s*', '', line)
                    questions.append(cleaned_line)
        return questions[:3]
