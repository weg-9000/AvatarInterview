from fastapi import APIRouter, Depends, HTTPException, Body
from app.agents.company_research_agent import CompanyResearchAgent
from app.agents.interview_question_agent import InterviewQuestionAgent
from app.db.repositories.question_repository import QuestionRepository
from app.db.repositories.response_repository import ResponseRepository
from datetime import datetime
import json

router = APIRouter()
company_research_agent = CompanyResearchAgent()
interview_question_agent = InterviewQuestionAgent()
question_repository = QuestionRepository()
response_repository = ResponseRepository()

@router.post("/research")
async def research_company(
    data: dict = Body(...)
):
    try:
        user_id = data.get("userId")
        company_name = data.get("companyName")
        job_position = data.get("jobPosition")
        
        if not all([user_id, company_name, job_position]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # 회사 연구 수행
        talent_ideal = await company_research_agent.research_company(
            company_name, job_position, user_id
        )
        
        
        return {
            "status": "success",
            "talentIdeal": talent_ideal
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-questions")
async def generate_interview_questions(
    data: dict = Body(...)
):
    try:
        user_id = data.get("userId")
        company_id = data.get("companyId")
        
        if not all([user_id, company_id]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # 면접 질문 생성
        questions = await interview_question_agent.generate_questions(
            user_id, company_id
        )
        
        
        return {
            "status": "success",
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-response")
async def save_interview_response(
    data: dict = Body(...)
):
    try:
        user_id = data.get("userId")
        question_id = data.get("questionId")
        question_text = data.get("questionText")
        answer_text = data.get("answerText")
        
        if not all([user_id, question_id, question_text, answer_text]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # 응답 저장
        response_data = {
            "userId": user_id,
            "questionId": question_id,
            "question": question_text,
            "answer": answer_text,
            "recordedAt": str(datetime.utcnow())
        }
        
        result = await response_repository.create_response(response_data)
        
        return {
            "status": "success",
            "message": "Response saved successfully",
            "responseId": result["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/questions/{user_id}")
async def get_interview_questions(user_id: str):
    try:
        questions = await question_repository.get_questions_by_user_id(user_id)
        if not questions:
            raise HTTPException(status_code=404, detail="Questions not found")
        
        return questions
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
