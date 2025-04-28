from typing import Dict, List, Optional
from app.db.cosmos_client import cosmos_db
import uuid

class ResponseRepository:
    def __init__(self):
        self.container = cosmos_db.responses_container
    
    async def create_response(self, response_data: Dict) -> Dict:
        # 고유 ID 생성
        response_data["id"] = f"response_{response_data['userId']}_{uuid.uuid4()}"
        
        # Cosmos DB에 저장
        response = self.container.create_item(body=response_data)
        return response
    
    async def get_response_by_id(self, response_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.id = '{response_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            return items[0]
        return None
    
    async def get_responses_by_user_id(self, user_id: str) -> Dict:
        query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        # 질문 ID 순서대로 정렬
        items.sort(key=lambda x: x.get("questionId", ""))
        
        return {"userId": user_id, "responses": items}
    
    async def update_response(self, response_id: str, response_data: Dict) -> Optional[Dict]:
        # 기존 응답 가져오기
        response = await self.get_response_by_id(response_id)
        
        if response:
            # 업데이트할 필드 적용
            for key, value in response_data.items():
                response[key] = value
            
            # Cosmos DB에 업데이트
            updated_response = self.container.replace_item(item=response["id"], body=response)
            return updated_response
        
        return None
    
    async def delete_response(self, response_id: str) -> bool:
        response = await self.get_response_by_id(response_id)
        
        if response:
            self.container.delete_item(item=response["id"], partition_key=response["userId"])
            return True
        
        return False

