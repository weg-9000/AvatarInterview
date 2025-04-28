from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # 요청 로깅
        logger.info(f"Request: {request.method} {request.url.path}")
        
        # 다음 미들웨어 또는 엔드포인트 호출
        response = await call_next(request)
        
        # 응답 시간 계산
        process_time = time.time() - start_time
        
        # 응답 로깅
        logger.info(f"Response: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")
        
        return response

def setup_middlewares(app):
    # CORS 미들웨어 설정
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 프로덕션에서는 구체적인 오리진 지정
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # 로깅 미들웨어 추가
    app.add_middleware(LoggingMiddleware)
