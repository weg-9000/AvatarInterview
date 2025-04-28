from typing import Dict, List, Optional
from app.db.cosmos_client import cosmos_db
from app.models.user import User, UserCreate
import uuid
class UserRepository:
    def __init__(self):
        self.container = cosmos_db.users_container
    
    async def create_user(self, user_data: Dict) -> Dict:
        # 고유 ID 생성
        user_data["id"] = f"user_{user_data['name']}_{uuid.uuid4()}"
        
        # 사용자 ID가 없으면 생성
        if "userId" not in user_data:
            user_data["userId"] = user_data["id"]
        
        # Cosmos DB에 저장
        response = self.container.create_item(body=user_data)
        return response
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            return items[0]
        return None
    
    async def update_user(self, user_id: str, user_data: Dict) -> Optional[Dict]:
        # 기존 사용자 가져오기
        user = await self.get_user_by_id(user_id)
        
        if user:
            # 업데이트할 필드 적용
            for key, value in user_data.items():
                user[key] = value
            
            # Cosmos DB에 업데이트
            response = self.container.replace_item(item=user["id"], body=user)
            return response
        
        return None
    
    async def delete_user(self, user_id: str) -> bool:
        user = await self.get_user_by_id(user_id)
        
        if user:
            self.container.delete_item(item=user["id"], partition_key=user["userId"])
            return True
        
        return False

