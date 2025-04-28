from typing import Dict, List, Optional
from app.db.cosmos_client import cosmos_db
import uuid
class EvaluationRepository:
    def __init__(self):
        self.container = cosmos_db.evaluations_container
    
    async def create_evaluation(self, evaluation_data: Dict) -> Dict:
        # 고유 ID 생성
        evaluation_data["id"] = f"evaluation_{evaluation_data['userId']}_{uuid.uuid4()}"
        
        # Cosmos DB에 저장
        response = self.container.create_item(body=evaluation_data)
        return response
    
    async def get_evaluation_by_id(self, evaluation_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.id = '{evaluation_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            return items[0]
        return None
    
    async def get_evaluation_by_user_id(self, user_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            # 가장 최근에 생성된 평가 반환
            items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
            return items[0]
        return None
    
    async def update_evaluation(self, evaluation_id: str, evaluation_data: Dict) -> Optional[Dict]:
        # 기존 평가 가져오기
        evaluation = await self.get_evaluation_by_id(evaluation_id)
        
        if evaluation:
            # 업데이트할 필드 적용
            for key, value in evaluation_data.items():
                evaluation[key] = value
            
            # Cosmos DB에 업데이트
            response = self.container.replace_item(item=evaluation["id"], body=evaluation)
            return response
        
        return None
    
    async def delete_evaluation(self, evaluation_id: str) -> bool:
        evaluation = await self.get_evaluation_by_id(evaluation_id)
        
        if evaluation:
            self.container.delete_item(item=evaluation["id"], partition_key=evaluation["userId"])
            return True
        
        return False
