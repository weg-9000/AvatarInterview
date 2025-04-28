from typing import Dict, List, Optional
from app.db.cosmos_client import cosmos_db
import uuid
class QuestionRepository:
    def __init__(self):
        self.container = cosmos_db.questions_container
    
    async def create_questions(self, question_data: Dict) -> Dict:
        # 고유 ID 생성
        question_data["id"] = f"questions_{question_data['userId']}_{uuid.uuid4()}"
        
        # Cosmos DB에 저장
        response = self.container.create_item(body=question_data)
        return response
    
    async def get_questions_by_id(self, question_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.id = '{question_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            return items[0]
        return None
    
    async def get_questions_by_user_id(self, user_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            # 가장 최근에 생성된 질문 반환
            items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
            return items[0]
        return None
    
    async def update_questions(self, question_id: str, question_data: Dict) -> Optional[Dict]:
        # 기존 질문 가져오기
        questions = await self.get_questions_by_id(question_id)
        
        if questions:
            # 업데이트할 필드 적용
            for key, value in question_data.items():
                questions[key] = value
            
            # Cosmos DB에 업데이트
            response = self.container.replace_item(item=questions["id"], body=questions)
            return response
        
        return None
    
    async def delete_questions(self, question_id: str) -> bool:
        questions = await self.get_questions_by_id(question_id)
        
        if questions:
            self.container.delete_item(item=questions["id"], partition_key=questions["userId"])
            return True
        
        return False
