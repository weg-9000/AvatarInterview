from typing import Dict, List, Optional
from app.db.cosmos_client import cosmos_db
import uuid

class ResumeRepository:
    def __init__(self):
        self.container = cosmos_db.resumes_container
    
    async def create_resume(self, resume_data: Dict) -> Dict:
        # 고유 ID 생성
        resume_data["id"] = f"resume_{resume_data['userId']}_{uuid.uuid4()}"
        
        # Cosmos DB에 저장
        response = self.container.create_item(body=resume_data)
        return response
    
    async def get_resume_by_id(self, resume_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.id = '{resume_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            return items[0]
        return None
    
    async def get_resume_by_user_id(self, user_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            # 가장 최근에 업로드된 이력서 반환
            items.sort(key=lambda x: x.get("uploadedAt", ""), reverse=True)
            return items[0]
        return None
    
    async def update_resume(self, resume_id: str, resume_data: Dict) -> Optional[Dict]:
        # 기존 이력서 가져오기
        resume = await self.get_resume_by_id(resume_id)
        
        if resume:
            # 업데이트할 필드 적용
            for key, value in resume_data.items():
                resume[key] = value
            
            # Cosmos DB에 업데이트
            response = self.container.replace_item(item=resume["id"], body=resume)
            return response
        
        return None
    
    async def delete_resume(self, resume_id: str) -> bool:
        resume = await self.get_resume_by_id(resume_id)
        
        if resume:
            self.container.delete_item(item=resume["id"], partition_key=resume["userId"])
            return True
        
        return False
