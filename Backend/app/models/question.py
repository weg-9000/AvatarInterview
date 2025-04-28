from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    userId: str
    companyId: str
    questions: List[str]  # 면접 질문 목록

class QuestionCreate(QuestionBase):
    pass

class QuestionInDB(QuestionBase):
    id: str
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Question(QuestionInDB):
    pass
