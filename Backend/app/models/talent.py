from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TalentIdealBase(BaseModel):
    userId: str
    companyId: str
    companyName: str
    jobPosition: str
    talentIdeal: str  # 회사 인재상 및 면접 관련 정보

class TalentIdealCreate(TalentIdealBase):
    pass

class TalentIdealInDB(TalentIdealBase):
    id: str
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class TalentIdeal(TalentIdealInDB):
    pass
