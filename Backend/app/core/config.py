import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # 애플리케이션 설정
    APP_NAME: str = "Interview Assistant API"
    
    # Cosmos DB 설정
    COSMOS_DB_ENDPOINT: str = os.getenv("COSMOS_DB_ENDPOINT")
    COSMOS_DB_KEY: str = os.getenv("COSMOS_DB_KEY")
    COSMOS_DB_DATABASE: str = os.getenv("COSMOS_DB_DATABASE")
    
    # Azure Document Intelligence 설정
    DOCUMENT_INTELLIGENCE_ENDPOINT: str = os.getenv("DOCUMENT_INTELLIGENCE_ENDPOINT")
    DOCUMENT_INTELLIGENCE_KEY: str = os.getenv("DOCUMENT_INTELLIGENCE_KEY")
    
    
    PERPLEXITY_ENDPOINT: str = os.getenv("PERPLEXITY_ENDPOINT")
    PERPLEXITY_API_KEY: str = os.getenv("PERPLEXITY_API_KEY")
    PERPLEXITY_DEPLOYMENT: str = os.getenv("PERPLEXITY_DEPLOYMENT")

    # Azure Speech Service 설정
    SPEECH_SERVICE_ENDPOINT: str = os.getenv("SPEECH_SERVICE_ENDPOINT")
    SPEECH_SERVICE_KEY: str = os.getenv("SPEECH_SERVICE_KEY")

settings = Settings()
