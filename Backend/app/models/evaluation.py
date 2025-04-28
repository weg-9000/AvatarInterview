from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EvaluationBase(BaseModel):
    userId: str
    companyId: str
    evaluation: str  # 면접 평가 내용

class EvaluationCreate(EvaluationBase):
    pass

class EvaluationInDB(EvaluationBase):
    id: str
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Evaluation(EvaluationInDB):
    pass
