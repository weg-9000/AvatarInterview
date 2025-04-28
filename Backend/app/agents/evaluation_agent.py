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
from app.db.repositories.evaluation_repository import EvaluationRepository
from app.db.repositories.resume_repository import ResumeRepository
from app.db.repositories.response_repository import ResponseRepository
from app.db.repositories.talent_repository import TalentRepository
from openai import AsyncOpenAI

custom_client = AsyncOpenAI(
    api_key=settings.PERPLEXITY_API_KEY,
    base_url=settings.PERPLEXITY_ENDPOINT
)

class EvaluationAgent:
    def __init__(self):
        # Semantic Kernel 초기화
        self.kernel = sk.Kernel()
        
        # Azure OpenAI 서비스 설정
        service_id = "evaluator"
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
            name="EvaluationAgent",
            instructions="""
            당신은 면접 평가 전문가입니다. 지원자의 면접 응답을 분석하고 종합적인 평가를 제공하는 것이 당신의 임무입니다.
            
            다음 항목에 대해 평가하세요:
            1. 응답의 관련성: 질문에 적절하게 대답했는가?
            2. 전문성: 해당 분야에 대한 지식과 이해를 보여주는가?
            3. 의사소통 능력: 생각을 명확하고 효과적으로 전달했는가?
            4. 문제 해결 능력: 논리적 사고와 창의적 해결책을 제시했는가?
            5. 회사 적합성: 회사의 가치와 문화에 얼마나 부합하는가?
            
            강점과 개선점을 구체적으로 제시하고, 종합적인 평가와 조언을 제공하세요.
            """,
            arguments=KernelArguments(settings=settings_obj)
        )
        
        # 리포지토리 초기화
        self.evaluation_repository = EvaluationRepository()
        self.resume_repository = ResumeRepository()
        self.response_repository = ResponseRepository()
        self.talent_repository = TalentRepository()
    
    async def evaluate_interview(self, user_id, company_id):
        try:
            # 이력서 데이터 가져오기
            resume_data = await self.resume_repository.get_resume_by_user_id(user_id)
            
            # 인재상 데이터 가져오기
            talent_data = await self.talent_repository.get_talent_ideal_by_company(company_id)
            
            # 응답 데이터 가져오기
            responses_data = await self.response_repository.get_responses_by_user_id(user_id)
            
            # 채팅 히스토리 생성
            history = ChatHistory()
            
            # 시스템 메시지 추가
            history.add_message(
                ChatMessageContent(
                    role=AuthorRole.SYSTEM, 
                    content="지원자의 면접 응답을 종합적으로 평가하고 강점과 개선점을 분석해주세요."
                )
            )
            
            # 사용자 메시지 추가
            history.add_message(
                ChatMessageContent(
                    role=AuthorRole.USER, 
                    content=f"""
                    ## 이력서 정보
                    {resume_data['resumeContent']['resumeContent']}
                    
                    ## 회사 인재상 및 직무 정보
                    {talent_data['talentIdeal']}
                    
                    ## 면접 질문 및 응답
                    {responses_data['responses']}
                    
                    위 정보를 바탕으로 지원자의 면접 응답을 종합적으로 평가해주세요.
                    """
                )
            )
            
            # 응답 생성
            response_text = ""
            async for response in self.agent.invoke(messages=history):
                response_text += str(response.content)
            
            # 결과를 데이터베이스에 저장
            evaluation_data = {
                "userId": user_id,
                "companyId": company_id,
                "evaluation": response_text,
                "createdAt": str(datetime.utcnow())
            }
            
            await self.evaluation_repository.create_evaluation(evaluation_data)
            
            return response_text
        except Exception as e:
            print(f"면접 평가 에이전트 오류: {str(e)}")
            raise
    
    def _format_responses(self, responses_data):
        formatted = ""
        for i, response in enumerate(responses_data['responses']):
            formatted += f"질문 {i+1}: {response['question']}\n"
            formatted += f"응답: {response['answer']}\n\n"
        return formatted
