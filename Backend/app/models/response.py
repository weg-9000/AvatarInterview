from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ResponseBase(BaseModel):
    userId: str
    questionId: str
    question: str  # 질문 텍스트
    answer: str    # 응답 텍스트

class ResponseCreate(ResponseBase):
    pass

class ResponseInDB(ResponseBase):
    id: str
    recordedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Response(ResponseInDB):
    pass
