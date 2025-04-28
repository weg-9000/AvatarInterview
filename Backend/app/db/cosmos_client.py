from azure.cosmos import CosmosClient, PartitionKey
from app.core.config import settings

class CosmosDB:
    def __init__(self):
        self.client = CosmosClient(settings.COSMOS_DB_ENDPOINT, settings.COSMOS_DB_KEY)
        self.database = self.client.get_database_client(settings.COSMOS_DB_DATABASE)
        
        # 필요한 컨테이너 확보
        self.users_container = self.database.get_container_client("UserProfiles")
        self.resumes_container = self.database.get_container_client("Resumes")
        self.talent_container = self.database.get_container_client("TalentIdeals")
        self.questions_container = self.database.get_container_client("Questions")
        self.responses_container = self.database.get_container_client("Responses")
        self.evaluations_container = self.database.get_container_client("Evaluations")
    
    # 컨테이너 존재 여부 확인 및 생성
    def ensure_containers_exist(self):
        containers = {
            "UserProfiles": "/userId",
            "Resumes": "/userId",
            "TalentIdeals": "/companyId",
            "Questions": "/userId",
            "Responses": "/userId",
            "Evaluations": "/userId"
        }
        
        for container_id, partition_key in containers.items():
            try:
                self.database.get_container_client(container_id)
            except:
                self.database.create_container(
                    id=container_id,
                    partition_key=PartitionKey(path=partition_key),
                    offer_throughput=400
                )

cosmos_db = CosmosDB()
