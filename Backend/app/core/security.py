from datetime import datetime, timedelta
from typing import Optional
import secrets
import string

def generate_random_token(length: int = 32) -> str:
    """안전한 랜덤 토큰 생성"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_session_id() -> str:
    """세션 ID 생성"""
    return generate_random_token(64)

def sanitize_input(input_str: str) -> str:
    """입력 문자열 정제"""
    # HTML 태그 제거 등의 정제 작업
    return input_str.replace("<", "&lt;").replace(">", "&gt;")
