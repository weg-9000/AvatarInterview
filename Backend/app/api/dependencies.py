from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from app.core.config import settings
from typing import Optional

# API 키 헤더 설정
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Depends(api_key_header)) -> str:
    """API 키 검증"""
    if settings.API_KEY_ENABLED:
        if not api_key or api_key != settings.API_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API Key"
            )
    return api_key

async def get_current_user(api_key: str = Depends(get_api_key)) -> dict:
    """현재 사용자 정보 가져오기"""
    # 실제 구현에서는 사용자 인증 로직 추가
    return {"user_id": "anonymous"}
