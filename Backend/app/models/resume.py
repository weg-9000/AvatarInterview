from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PersonalInfo(BaseModel):
    name: str

class ApplicationInfo(BaseModel):
    company: str
    position: str

class ResumeContent(BaseModel):
    resumeContent: Optional[str] = None

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    applicationInfo: ApplicationInfo
    resumeContent: ResumeContent

class ResumeBase(BaseModel):
    userId: str
    fileName: str
    resumeContent: str  

class ResumeCreate(ResumeBase):
    pass

class ResumeInDB(ResumeBase):
    id: str
    uploadedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    processedAt: Optional[str] = None

class Resume(ResumeInDB):
    pass
