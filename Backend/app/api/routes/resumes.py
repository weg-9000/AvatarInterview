from fastapi import APIRouter, Body, HTTPException
from app.services.resume_processor import process_resume_data
from app.db.repositories.resume_repository import ResumeRepository

router = APIRouter()
resume_repository = ResumeRepository()

@router.post("/{user_id}/create")
async def create_resume(
    user_id: str,
    resume_data: dict = Body(...)
):
    try:
        processed_data = await process_resume_data(resume_data)
        resume_to_save = {
            "userId": user_id,
            "fileName": "user_input_resume",
            **processed_data
        }
        result = await resume_repository.create_resume(resume_to_save)
        return {
            "status": "success",
            "message": "Resume created successfully",
            "resumeId": result["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_resume(user_id: str):
    try:
        resume = await resume_repository.get_resume_by_user_id(user_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        return resume
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))