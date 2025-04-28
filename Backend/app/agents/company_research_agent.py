import semantic_kernel as sk
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.contents.chat_message_content import ChatMessageContent
from semantic_kernel.contents.utils.author_role import AuthorRole
from semantic_kernel.functions.kernel_arguments import KernelArguments
from openai import AsyncOpenAI
from datetime import datetime
from app.core.config import settings
from app.db.repositories.talent_repository import TalentRepository


custom_client = AsyncOpenAI(
    api_key=settings.PERPLEXITY_API_KEY,
    base_url=settings.PERPLEXITY_ENDPOINT
)

class CompanyResearchAgent:
    def __init__(self):
        self.kernel = sk.Kernel()
        
        service_id = "company_research"
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
            name="CompanyResearchAgent",
            instructions="""
            당신은 회사 연구 전문가입니다. 주어진 회사와 직무에 대한 인재상과 면접 관련 정보를 조사하는 것이 당신의 임무입니다.
            
            다음 정보를 제공해야 합니다:
            
            1. 회사의 핵심 가치와 문화
            2. 해당 직무에 필요한 주요 기술과 역량
            3. 회사의 인재상과 선호하는 인재 특성
            4. 면접에서 자주 묻는 질문 유형
            5. 회사의 최근 동향이나 프로젝트
            
            정보는 구조화되고 명확하게 제공하세요.
            
            회사: {{$company_name}}
            직무: {{$job_position}}
            현재 시간: {{$now}}
            
            위 회사와 직무에 대한 인재상과 면접 관련 정보를 조사해주세요.
            """,
            arguments=KernelArguments(settings=settings_obj)
        )
        
        self.talent_repository = TalentRepository()
        
    async def research_company(self, company_name, job_position, user_id,validation_message=None):
        try:
            # 채팅 히스토리 생성
            history = ChatHistory()
    
            history.add_message(
                ChatMessageContent(
                    role=AuthorRole.USER,
                    content=f"{company_name} 회사의 {job_position} 직무에 대한 인재상과 면접 정보를 알려주세요."
            
                )
            )


            
            # 에이전트 호출을 위한 인자 설정
            arguments = KernelArguments(
                company_name=company_name,
                job_position=job_position,
                now=datetime.now().strftime("%Y-%m-%d %H:%M")
            )
            
            # 응답 생성
            response_text = ""
            async for response in self.agent.invoke(messages=history, arguments=arguments):
                response_text += str(response.content)

                
            # 결과를 데이터베이스에 저장
            talent_data = {
                "userId": user_id,
                "companyId": company_name.lower().replace(" ", "_"),
                "companyName": company_name,
                "jobPosition": job_position,
                "talentIdeal": response_text,
                "createdAt": str(datetime.utcnow())
            }
            
            await self.talent_repository.create_talent_ideal(talent_data)
            return response_text
            
        except Exception as e:
            print(f"회사 연구 에이전트 오류: {str(e)}")
            raise
