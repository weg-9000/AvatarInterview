from fastapi import APIRouter, HTTPException, Body
from app.db.repositories.user_repository import UserRepository
from app.models.user import UserCreate, User
from typing import Dict, Optional
from datetime import datetime

router = APIRouter()
user_repository = UserRepository()

@router.post("/create")
async def create_user(
    data: Optional[Dict] = Body(...)  # Body(...) 대신 사용
):
    try:
        # 데이터 유효성 검사
        if not data:
            raise HTTPException(status_code=400, detail="Request body is empty")
        
        # 필수 필드 확인
        required_fields = ["name", "companyName", "jobPosition"]
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # 사용자 데이터 준비
        user_data = {
            "name": data["name"],
            "companyName": data["companyName"],
            "jobPosition": data["jobPosition"],
            "userId": f"user_{data['name']}_{datetime.utcnow().timestamp()}".replace(" ", "_"),
            "createdAt": str(datetime.utcnow())
        }
        
        # 사용자 생성
        result = await user_repository.create_user(user_data)
        
        return {
            "status": "success",
            "message": "User created successfully",
            "userId": user_data["userId"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_user(user_id: str):
    try:
        user = await user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}")
async def update_user(
    user_id: str,
    data: Dict = Body(...)
):
    try:
        # 사용자 존재 확인
        user = await user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 사용자 업데이트
        result = await user_repository.update_user(user_id, data)
        
        return {
            "status": "success",
            "message": "User updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    try:
        # 사용자 존재 확인
        user = await user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 사용자 삭제
        result = await user_repository.delete_user(user_id)
        
        return {
            "status": "success",
            "message": "User deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
