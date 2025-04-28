from typing import Dict, List, Optional
from app.db.cosmos_client import cosmos_db
import uuid
class TalentRepository:
    def __init__(self):
        self.container = cosmos_db.talent_container
    
    async def create_talent_ideal(self, talent_data: Dict) -> Dict:
        # 고유 ID 생성
        talent_data["id"] = f"talent_{talent_data['companyId']}{talent_data['jobPosition'].replace(' ', '_')}_{uuid.uuid4()}"
        
        # Cosmos DB에 저장
        response = self.container.create_item(body=talent_data)
        return response
    
    async def get_talent_ideal_by_id(self, talent_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.id = '{talent_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            return items[0]
        return None
    
    async def get_talent_ideal_by_company(self, company_id: str) -> Optional[Dict]:
        query = f"SELECT * FROM c WHERE c.companyId = '{company_id}'"
        items = list(self.container.query_items(query=query, enable_cross_partition_query=True))
        
        if items:
            # 가장 최근에 생성된 인재상 반환
            items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
            return items[0]
        return None
    
    async def update_talent_ideal(self, talent_id: str, talent_data: Dict) -> Optional[Dict]:
        # 기존 인재상 가져오기
        talent = await self.get_talent_ideal_by_id(talent_id)
        
        if talent:
            # 업데이트할 필드 적용
            for key, value in talent_data.items():
                talent[key] = value
            
            # Cosmos DB에 업데이트
            response = self.container.replace_item(item=talent["id"], body=talent)
            return response
        
        return None
    
    async def delete_talent_ideal(self, talent_id: str) -> bool:
        talent = await self.get_talent_ideal_by_id(talent_id)
        
        if talent:
            self.container.delete_item(item=talent["id"], partition_key=talent["companyId"])
            return True
        
        return False

