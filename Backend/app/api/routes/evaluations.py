from fastapi import APIRouter, Depends, HTTPException, Body
from app.agents.evaluation_agent import EvaluationAgent
from app.db.repositories.evaluation_repository import EvaluationRepository
from datetime import datetime

router = APIRouter()
evaluation_agent = EvaluationAgent()
evaluation_repository = EvaluationRepository()

@router.post("/generate")
async def generate_evaluation(
    data: dict = Body(...)
):
    try:
        user_id = data.get("userId")
        company_id = data.get("companyId")
        
        if not all([user_id, company_id]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # 면접 평가 생성
        evaluation = await evaluation_agent.evaluate_interview(
            user_id, company_id
        )
        
        return {
            "status": "success",
            "evaluation": evaluation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_evaluation(user_id: str):
    try:
        evaluation = await evaluation_repository.get_evaluation_by_user_id(user_id)
        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluation not found")
        
        return evaluation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
