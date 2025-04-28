from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    companyName: str
    jobPosition: str

class UserCreate(UserBase):
    pass

class UserInDB(UserBase):
    id: str
    userId: str
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class User(UserInDB):
    pass
